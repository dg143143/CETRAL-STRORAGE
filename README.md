# Central Storage Server

A simple C++ backend server that provides a key-value storage system over HTTP.

## Requirements

*   A C++ compiler (like `g++`)
*   `cmake`
*   `make`

## Building

1.  Create a build directory:
    ```bash
    mkdir build
    ```

2.  Navigate into the build directory:
    ```bash
    cd build
    ```

3.  Run CMake to generate the build files:
    ```bash
    cmake ..
    ```

4.  Compile the project:
    ```bash
    make
    ```
    This will create an executable named `server` in the `build` directory.

## Running

From the `build` directory, run the server:
```bash
./server
```
The server will start and listen on port 8080.

## API Usage

You can use `curl` to interact with the server.

### Set a value

To create or update a key-value pair, use a `POST` request. The key is specified in the URL path, and the value is in the request body.

```bash
# Set the key 'mykey' to the value 'myvalue'
curl -X POST -d 'myvalue' http://localhost:8080/mykey
```

### Get a value

To retrieve the value for a key, use a `GET` request.

```bash
# Get the value for the key 'mykey'
curl http://localhost:8080/mykey
```

### Delete a value

To delete a key-value pair, use a `DELETE` request.

```bash
# Delete the key 'mykey'
curl -X DELETE http://localhost:8080/mykey
```
