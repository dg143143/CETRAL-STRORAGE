#include <iostream>
#include <string>
#include <vector>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <sstream>

#include "storage.h"

Storage storage;

void handle_client(int client_socket) {
    char buffer[4096] = {0};
    read(client_socket, buffer, 4096);
    std::string request(buffer);

    std::istringstream request_stream(request);
    std::string method, path, http_version;
    request_stream >> method >> path >> http_version;

    std::string response;
    std::string body;

    if (path.length() > 1) { // path should be like /key
        std::string key = path.substr(1);

        if (method == "GET") {
            if (storage.has(key)) {
                body = storage.get(key);
                response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            } else {
                body = "Not Found";
                response = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            }
        } else if (method == "POST") {
            size_t body_start = request.find("\r\n\r\n");
            if (body_start != std::string::npos) {
                std::string value = request.substr(body_start + 4);
                storage.set(key, value);
                body = "OK";
                response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            } else {
                 body = "Bad Request";
                 response = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            }

        } else if (method == "DELETE") {
            if (storage.has(key)) {
                storage.remove(key);
                body = "OK";
                response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            } else {
                body = "Not Found";
                response = "HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
            }
        } else {
            body = "Method Not Allowed";
            response = "HTTP/1.1 405 Method Not Allowed\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
        }
    } else {
        body = "Bad Request";
        response = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain\r\nContent-Length: " + std::to_string(body.length()) + "\r\n\r\n" + body;
    }

    write(client_socket, response.c_str(), response.length());
    close(client_socket);
}

int main() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int opt = 1;
    int addrlen = sizeof(address);

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR | SO_REUSEPORT, &opt, sizeof(opt))) {
        perror("setsockopt");
        exit(EXIT_FAILURE);
    }
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(8080);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    if (listen(server_fd, 10) < 0) { // Increased backlog from 3 to 10
        perror("listen");
        exit(EXIT_FAILURE);
    }

    std::cout << "Server listening on port 8080..." << std::endl;

    while(true) {
        if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            perror("accept");
            continue; // Continue instead of exiting
        }
        // A simple iterative server. For a real server, we'd use threads or other concurrency mechanisms.
        handle_client(new_socket);
    }

    return 0;
}
