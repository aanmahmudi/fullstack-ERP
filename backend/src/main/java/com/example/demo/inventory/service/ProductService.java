package com.example.demo.inventory.service;

import com.example.demo.inventory.dto.CategoryDTO;
import com.example.demo.inventory.dto.ProductDTO;
import com.example.demo.inventory.dto.WarehouseDTO;
import com.example.demo.inventory.entity.Category;
import com.example.demo.inventory.entity.Product;
import com.example.demo.inventory.entity.Warehouse;
import com.example.demo.inventory.repository.CategoryRepository;
import com.example.demo.inventory.repository.ProductRepository;
import com.example.demo.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final WarehouseRepository warehouseRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, WarehouseRepository warehouseRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.warehouseRepository = warehouseRepository;
    }

    // Category Methods
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (categoryRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Category with name " + dto.getName() + " already exists");
        }
        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        if (dto.getParentId() != null) {
            Category parent = categoryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParent(parent);
        }
        Category saved = categoryRepository.save(category);
        return mapToDTO(saved);
    }

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private CategoryDTO mapToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        if (category.getParent() != null) {
            dto.setParentId(category.getParent().getId());
        }
        return dto;
    }

    // Product Methods
    public ProductDTO createProduct(ProductDTO dto) {
        if (productRepository.existsBySku(dto.getSku())) {
            throw new RuntimeException("Product with SKU " + dto.getSku() + " already exists");
        }
        Product product = new Product();
        product.setSku(dto.getSku());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setUnitPrice(dto.getUnitPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setUom(dto.getUom());
        product.setReorderLevel(dto.getReorderLevel());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setUnitPrice(product.getUnitPrice());
        dto.setCostPrice(product.getCostPrice());
        dto.setUom(product.getUom());
        dto.setReorderLevel(product.getReorderLevel());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }
        return dto;
    }

    // Warehouse Methods
    public WarehouseDTO createWarehouse(WarehouseDTO dto) {
        if (warehouseRepository.existsByName(dto.getName())) {
            throw new RuntimeException("Warehouse with name " + dto.getName() + " already exists");
        }
        Warehouse warehouse = new Warehouse();
        warehouse.setName(dto.getName());
        warehouse.setLocation(dto.getLocation());
        Warehouse saved = warehouseRepository.save(warehouse);
        return mapToDTO(saved);
    }

    public List<WarehouseDTO> getAllWarehouses() {
        return warehouseRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private WarehouseDTO mapToDTO(Warehouse warehouse) {
        WarehouseDTO dto = new WarehouseDTO();
        dto.setId(warehouse.getId());
        dto.setName(warehouse.getName());
        dto.setLocation(warehouse.getLocation());
        return dto;
    }
}
