package com.example.demo.inventory.controller;

import com.example.demo.inventory.dto.StockTransactionDTO;
import com.example.demo.inventory.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/transactions")
    public ResponseEntity<String> processTransaction(@RequestBody StockTransactionDTO dto) {
        inventoryService.processTransaction(dto);
        return ResponseEntity.ok("Transaction processed successfully");
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferStock(@RequestParam Long productId,
                                                @RequestParam Long fromWarehouseId,
                                                @RequestParam Long toWarehouseId,
                                                @RequestParam Integer quantity,
                                                @RequestParam(required = false) String reference,
                                                @RequestParam(required = false) String notes) {
        inventoryService.transferStock(productId, fromWarehouseId, toWarehouseId, quantity, reference, notes);
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/stock")
    public ResponseEntity<Integer> getStockLevel(@RequestParam Long productId, @RequestParam Long warehouseId) {
        return ResponseEntity.ok(inventoryService.getStockLevel(productId, warehouseId));
    }
}
