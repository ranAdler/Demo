package com.demo.controller;

import com.demo.model.FlightApiResponse;
import com.demo.model.FlightRecord;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@Tag(name = "Flights", description = "Ben Gurion Airport Flight Board API")
public class FlightController {
    private static final Logger logger = LoggerFactory.getLogger(FlightController.class);
    private static final String API_URL = "https://data.gov.il/api/3/action/datastore_search?resource_id=e83f763b-b7d7-479e-b172-ae981ddc6de5";

    private final RestTemplate restTemplate;

    public FlightController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping
    public List<FlightRecord> getFlights() {
        logger.info("GET /api/flights - Fetching flights from Ben Gurion Airport API");
        try {
            FlightApiResponse response = restTemplate.getForObject(API_URL, FlightApiResponse.class);
            if (response != null && response.getResult() != null) {
                List<FlightRecord> flights = response.getResult().getRecords();
                logger.info("GET /api/flights - Retrieved {} flights", flights != null ? flights.size() : 0);
                return flights;
            }
            logger.warn("GET /api/flights - Unexpected response structure from API");
            return List.of();
        } catch (Exception e) {
            logger.error("GET /api/flights - Error fetching flights from API", e);
            throw new RuntimeException("Failed to fetch flight data", e);
        }
    }
}