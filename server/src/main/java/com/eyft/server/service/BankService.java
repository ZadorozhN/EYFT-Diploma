package com.eyft.server.service;

public interface BankService {
    void withdraw(String login, long cents);
    void deposit(String login, long cents);
}
