package com.eyft.server.config;

import org.h2.tools.Server;
import org.springframework.context.annotation.Bean;

import java.sql.SQLException;


public class H2Configuration {

    @Bean(initMethod = "start", destroyMethod = "stop")
    public Server inMemoryH2DatabaseServer() throws SQLException {
        return Server.createTcpServer(
                "-tcp", "-tcpAllowOthers", "-tcpPort", "9090");
    }
}
