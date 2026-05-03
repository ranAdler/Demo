package com.demo.controller;

import com.demo.model.Item;
import com.demo.repository.ItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")

@Tag(name = "Items", description = "Item management API")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemRepository repo;

    public ItemController(ItemRepository repo) {
        this.repo = repo;
        logger.info("ItemController initialized");
    }

    @GetMapping
    @Operation(summary = "Get all items", description = "Retrieve a list of all items")
    public List<Item> getAll() {
        logger.info("GET /api/items - Fetching all items");
        List<Item> items = repo.findAll();
        logger.info("GET /api/items - Found {} items", items.size());
        return items;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID", description = "Retrieve a single item by its ID")
    public ResponseEntity<Item> getOne(@PathVariable Long id) {
        logger.info("GET /api/items/{} - Fetching item by ID", id);
        var result = repo.findById(id)
                .map(item -> {
                    logger.info("GET /api/items/{} - Found item: {}", id, item.getName());
                    return ResponseEntity.ok(item);
                })
                .orElseGet(() -> {
                    logger.warn("GET /api/items/{} - Item not found", id);
                    return ResponseEntity.notFound().build();
                });
        return result;
    }

    @PostMapping
    @Operation(summary = "Create a new item", description = "Create a new item with the provided name")
    public Item create(@RequestBody Item item) {
        logger.info("POST /api/items - Creating new item with name: {}", item.getName());
        Item saved = repo.save(item);
        logger.info("POST /api/items - Item created successfully with ID: {}", saved.getId());
        return saved;
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an item", description = "Update the name of an existing item")
    public ResponseEntity<Item> update(@PathVariable Long id,
                                       @RequestBody Item updated) {
        logger.info("PUT /api/items/{} - Updating item to name: {}", id, updated.getName());
        var result = repo.findById(id).map(existing -> {
            String oldName = existing.getName();
            existing.setName(updated.getName());
            Item saved = repo.save(existing);
            logger.info("PUT /api/items/{} - Item updated successfully (old: '{}', new: '{}')", id, oldName, updated.getName());
            return ResponseEntity.ok(saved);
        }).orElseGet(() -> {
            logger.warn("PUT /api/items/{} - Item not found for update", id);
            return ResponseEntity.notFound().build();
        });
        return result;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an item", description = "Delete an item by its ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        logger.info("DELETE /api/items/{} - Attempting to delete item", id);
        if (!repo.existsById(id)) {
            logger.warn("DELETE /api/items/{} - Item not found for deletion", id);
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        logger.info("DELETE /api/items/{} - Item deleted successfully", id);
        return ResponseEntity.noContent().build();
    }
}