package com.eyft.server.service;

public interface MoneyHandler {
    void handleRequest(String accountId, Long delta);
}
