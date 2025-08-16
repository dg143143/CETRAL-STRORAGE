cmake_minimum_required(VERSION 3.10)
project(central_storage_server)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_executable(server src/main.cpp src/storage.cpp)
