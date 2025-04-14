export default function findCacheDir() {
    return typeof window === 'undefined' ? require('find-cache-dir')() : null;
  }