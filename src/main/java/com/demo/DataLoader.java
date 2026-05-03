package com.demo;

import com.demo.model.Item;
import com.demo.repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Bean
    ApplicationRunner loadData(ItemRepository repo) {
        return args -> {
            logger.info("DataLoader: Starting to seed database with initial items");
            Item item1 = repo.save(new Item("First item"));
            logger.info("DataLoader: Seeded item 1 with ID: {}", item1.getId());

            Item item2 = repo.save(new Item("Second item"));
            logger.info("DataLoader: Seeded item 2 with ID: {}", item2.getId());

            logger.info("DataLoader: Database seeding completed");
        };
    }
}