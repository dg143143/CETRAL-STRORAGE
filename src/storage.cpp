#include "storage.h"

void Storage::set(const std::string& key, const std::string& value) {
    std::lock_guard<std::mutex> lock(mutex_);
    map_[key] = value;
}

std::string Storage::get(const std::string& key) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (map_.find(key) != map_.end()) {
        return map_[key];
    }
    return "";
}

bool Storage::has(const std::string& key) {
    std::lock_guard<std::mutex> lock(mutex_);
    return map_.find(key) != map_.end();
}

void Storage::remove(const std::string& key) {
    std::lock_guard<std::mutex> lock(mutex_);
    map_.erase(key);
}
