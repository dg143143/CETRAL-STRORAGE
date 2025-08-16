#ifndef STORAGE_H
#define STORAGE_H

#include <string>
#include <unordered_map>
#include <mutex>

class Storage {
public:
    void set(const std::string& key, const std::string& value);
    std::string get(const std::string& key);
    bool has(const std::string& key);
    void remove(const std::string& key);

private:
    std::unordered_map<std::string, std::string> map_;
    std::mutex mutex_;
};

#endif // STORAGE_H
