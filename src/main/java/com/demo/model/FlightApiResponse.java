package com.demo.model;

import java.util.List;

public class FlightApiResponse {
    private boolean success;
    private Result result;

    public static class Result {
        private List<FlightRecord> records;
        private int total;

        public List<FlightRecord> getRecords() {
            return records;
        }

        public void setRecords(List<FlightRecord> records) {
            this.records = records;
        }

        public int getTotal() {
            return total;
        }

        public void setTotal(int total) {
            this.total = total;
        }
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }
}