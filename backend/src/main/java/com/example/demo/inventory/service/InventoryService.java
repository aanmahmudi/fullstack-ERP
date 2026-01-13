package com.example.demo.inventory.service;

import com.example.demo.inventory.dto.StockTransactionDTO;
import com.example.demo.inventory.entity.*;
import com.example.demo.inventory.repository.ProductRepository;
import com.example.demo.inventory.repository.StockRepository;
import com.example.demo.inventory.repository.StockTransactionRepository;
import com.example.demo.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class InventoryService {
    private final StockRepository stockRepository;
    private final StockTransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryService(StockRepository stockRepository, StockTransactionRepository transactionRepository, ProductRepository productRepository, WarehouseRepository warehouseRepository) {
        this.stockRepository = stockRepository;
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public void processTransaction(StockTransactionDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Warehouse warehouse = warehouseRepository.findById(dto.getWarehouseId())
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        // Create Transaction Record
        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setWarehouse(warehouse);
        transaction.setType(dto.getType());
        transaction.setQuantity(dto.getQuantity());
        transaction.setReferenceNumber(dto.getReferenceNumber());
        transaction.setNotes(dto.getNotes());
        if (dto.getTransactionDate() != null) {
            transaction.setTransactionDate(dto.getTransactionDate());
        }
        transactionRepository.save(transaction);

        // Update Stock
        Stock stock = stockRepository.findByProductAndWarehouse(product, warehouse)
                .orElse(new Stock());
        
        if (stock.getId() == null) {
            stock.setProduct(product);
            stock.setWarehouse(warehouse);
            stock.setQuantity(0);
        }

        switch (dto.getType()) {
            case INBOUND:
                stock.setQuantity(stock.getQuantity() + dto.getQuantity());
                break;
            case OUTBOUND:
                if (stock.getQuantity() < dto.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product " + product.getName() + " in warehouse " + warehouse.getName());
                }
                stock.setQuantity(stock.getQuantity() - dto.getQuantity());
                break;
            case ADJUSTMENT:
                // Adjustment usually means adding/subtracting to match physical count or direct set.
                // Here we assume quantity is the adjustment amount (positive or negative).
                // Or should it be the final count?
                // Let's assume it's an additive adjustment for now.
                // If the user wants to set exact stock, they should calculate the difference.
                // A better approach for "Physical Count" is to calculate the diff.
                // But for "Adjustment" transaction, let's treat it as +/-.
                int newQuantity = stock.getQuantity() + dto.getQuantity();
                if (newQuantity < 0) {
                     throw new RuntimeException("Adjustment results in negative stock");
                }
                stock.setQuantity(newQuantity);
                break;
            case TRANSFER:
                 // Transfer logic usually involves two transactions (OUT from Source, IN to Destination).
                 // For simplicity in this single-transaction API, TRANSFER might not be directly supported 
                 // without a destination warehouse.
                 // We will handle TRANSFER as two separate calls from the controller/frontend or a separate method.
                 // If this method receives TRANSFER, it's ambiguous.
                 throw new UnsupportedOperationException("Use transferStock method for transfers");
        }
        
        stockRepository.save(stock);
    }

    public void transferStock(Long productId, Long fromWarehouseId, Long toWarehouseId, Integer quantity, String reference, String notes) {
        if (fromWarehouseId.equals(toWarehouseId)) {
            throw new RuntimeException("Source and Destination warehouses must be different");
        }

        // Outbound from Source
        StockTransactionDTO outDto = new StockTransactionDTO();
        outDto.setProductId(productId);
        outDto.setWarehouseId(fromWarehouseId);
        outDto.setType(TransactionType.TRANSFER); // We mark it as TRANSFER type for record
        outDto.setQuantity(quantity);
        outDto.setReferenceNumber(reference);
        outDto.setNotes("Transfer Out to Warehouse " + toWarehouseId + ". " + notes);
        
        // We need to handle the stock update logic manually or reuse logic.
        // Let's implement specific logic here to avoid recursion issues or type mismatch.
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Warehouse fromWarehouse = warehouseRepository.findById(fromWarehouseId)
                .orElseThrow(() -> new RuntimeException("Source Warehouse not found"));
        Warehouse toWarehouse = warehouseRepository.findById(toWarehouseId)
                .orElseThrow(() -> new RuntimeException("Destination Warehouse not found"));

        Stock fromStock = stockRepository.findByProductAndWarehouse(product, fromWarehouse)
                .orElseThrow(() -> new RuntimeException("Stock not found in source warehouse"));
        
        if (fromStock.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock in source warehouse");
        }
        
        fromStock.setQuantity(fromStock.getQuantity() - quantity);
        stockRepository.save(fromStock);

        StockTransaction outTransaction = new StockTransaction();
        outTransaction.setProduct(product);
        outTransaction.setWarehouse(fromWarehouse);
        outTransaction.setType(TransactionType.OUTBOUND); // Physically it's an outbound
        outTransaction.setQuantity(quantity);
        outTransaction.setReferenceNumber(reference);
        outTransaction.setNotes("Transfer To " + toWarehouse.getName());
        transactionRepository.save(outTransaction);

        // Inbound to Destination
        Stock toStock = stockRepository.findByProductAndWarehouse(product, toWarehouse)
                .orElse(new Stock());
        if (toStock.getId() == null) {
            toStock.setProduct(product);
            toStock.setWarehouse(toWarehouse);
            toStock.setQuantity(0);
        }
        toStock.setQuantity(toStock.getQuantity() + quantity);
        stockRepository.save(toStock);

        StockTransaction inTransaction = new StockTransaction();
        inTransaction.setProduct(product);
        inTransaction.setWarehouse(toWarehouse);
        inTransaction.setType(TransactionType.INBOUND); // Physically it's an inbound
        inTransaction.setQuantity(quantity);
        inTransaction.setReferenceNumber(reference);
        inTransaction.setNotes("Transfer From " + fromWarehouse.getName());
        transactionRepository.save(inTransaction);
    }
    
    public Integer getStockLevel(Long productId, Long warehouseId) {
         Product product = productRepository.findById(productId).orElseThrow();
         Warehouse warehouse = warehouseRepository.findById(warehouseId).orElseThrow();
         return stockRepository.findByProductAndWarehouse(product, warehouse)
                 .map(Stock::getQuantity)
                 .orElse(0);
    }
}
