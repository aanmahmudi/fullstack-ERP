package com.example.demo.api;

import java.time.Instant;
import java.util.Map;

public record ApiError(String message, Instant timestamp, Map<String, String> fieldErrors) {
}
