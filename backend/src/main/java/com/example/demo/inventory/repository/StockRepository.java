package com.example.demo.inventory.repository;

import com.example.demo.inventory.entity.Product;
import com.example.demo.inventory.entity.Stock;
import com.example.demo.inventory.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProductAndWarehouse(Product product, Warehouse warehouse);
    List<Stock> findByProduct(Product product);
    List<Stock> findByWarehouse(Warehouse warehouse);
}
