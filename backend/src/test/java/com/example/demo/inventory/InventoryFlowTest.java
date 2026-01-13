package com.example.demo.inventory;

import com.example.demo.inventory.dto.CategoryDTO;
import com.example.demo.inventory.dto.ProductDTO;
import com.example.demo.inventory.dto.StockTransactionDTO;
import com.example.demo.inventory.dto.WarehouseDTO;
import com.example.demo.inventory.entity.TransactionType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class InventoryFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static Long categoryId;
    private static Long warehouseId;
    private static Long productId;
    private static final String SUFFIX = UUID.randomUUID().toString().substring(0, 8);

    @Test
    @Order(1)
    public void createCategory() throws Exception {
        CategoryDTO dto = new CategoryDTO();
        dto.setName("Electronics-" + SUFFIX);
        dto.setDescription("Electronic Gadgets");

        MvcResult result = mockMvc.perform(post("/api/inventory/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        CategoryDTO created = objectMapper.readValue(response, CategoryDTO.class);
        categoryId = created.getId();
    }

    @Test
    @Order(2)
    public void createWarehouse() throws Exception {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setName("Main Warehouse-" + SUFFIX);
        dto.setLocation("Jakarta");

        MvcResult result = mockMvc.perform(post("/api/inventory/warehouses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        WarehouseDTO created = objectMapper.readValue(response, WarehouseDTO.class);
        warehouseId = created.getId();
    }

    @Test
    @Order(3)
    public void createProduct() throws Exception {
        ProductDTO dto = new ProductDTO();
        dto.setSku("LAPTOP-001-" + SUFFIX);
        dto.setName("Gaming Laptop-" + SUFFIX);
        dto.setDescription("High-end gaming laptop");
        dto.setCategoryId(categoryId);
        dto.setUnitPrice(new BigDecimal("15000000"));
        dto.setCostPrice(new BigDecimal("12000000"));
        dto.setUom("UNIT");
        dto.setReorderLevel(5);

        MvcResult result = mockMvc.perform(post("/api/inventory/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        ProductDTO created = objectMapper.readValue(response, ProductDTO.class);
        productId = created.getId();
    }

    @Test
    @Order(4)
    public void addStock() throws Exception {
        StockTransactionDTO dto = new StockTransactionDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setType(TransactionType.INBOUND);
        dto.setQuantity(50);
        dto.setReferenceNumber("PO-001");
        dto.setNotes("Initial Stock");

        mockMvc.perform(post("/api/inventory/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    @Order(5)
    public void checkStock() throws Exception {
        mockMvc.perform(get("/api/inventory/stock")
                        .param("productId", productId.toString())
                        .param("warehouseId", warehouseId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(50));
    }
    
    @Test
    @Order(6)
    public void reduceStock() throws Exception {
        StockTransactionDTO dto = new StockTransactionDTO();
        dto.setProductId(productId);
        dto.setWarehouseId(warehouseId);
        dto.setType(TransactionType.OUTBOUND);
        dto.setQuantity(10);
        dto.setReferenceNumber("SO-001");
        dto.setNotes("Sales Order");

        mockMvc.perform(post("/api/inventory/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
                
        mockMvc.perform(get("/api/inventory/stock")
                        .param("productId", productId.toString())
                        .param("warehouseId", warehouseId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").value(40));
    }
}
