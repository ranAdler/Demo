package com.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FlightRecord {
    @JsonProperty("CHOPER")
    private String airlineCode;

    @JsonProperty("CHFLTN")
    private String flightNumber;

    @JsonProperty("CHOPERD")
    private String airlineName;

    @JsonProperty("CHSTOL")
    private String scheduledTime;

    @JsonProperty("CHPTOL")
    private String actualTime;

    @JsonProperty("CHAORD")
    private String direction;

    @JsonProperty("CHLOC1")
    private String destinationCode;

    @JsonProperty("CHLOC1D")
    private String destination;

    @JsonProperty("CHLOCCT")
    private String country;

    @JsonProperty("CHRMINE")
    private String status;

    public FlightRecord() {}

    public String getAirlineCode() {
        return airlineCode;
    }

    public void setAirlineCode(String airlineCode) {
        this.airlineCode = airlineCode;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAirlineName() {
        return airlineName;
    }

    public void setAirlineName(String airlineName) {
        this.airlineName = airlineName;
    }

    public String getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getActualTime() {
        return actualTime;
    }

    public void setActualTime(String actualTime) {
        this.actualTime = actualTime;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getDestinationCode() {
        return destinationCode;
    }

    public void setDestinationCode(String destinationCode) {
        this.destinationCode = destinationCode;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}