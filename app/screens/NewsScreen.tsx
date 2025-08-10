import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Keyboard,
    Linking,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const API_KEY = "7e0e00ac05934f11957be8c6a417d1c8";

type Article = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

function getDateFrom30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().slice(0, 10);
}

export default function NewsScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchText, setSearchText] = useState("");

  const fetchNews = async (
    pageNumber: number,
    newSearch = false,
    isRefresh = false
  ) => {
    if (loading) return;
    setLoading(true);

    const DATE_FROM = getDateFrom30DaysAgo();

    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        searchText || "technology"
      )}&from=${DATE_FROM}&sortBy=popularity&language=en&page=${pageNumber}&apiKey=${API_KEY}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.status === "ok") {
        setTotalResults(json.totalResults);
        if (newSearch) {
          setArticles(json.articles);
        } else {
          setArticles((prev) => [...prev, ...json.articles]);
        }
      } else {
        console.warn("API error", json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const loadMore = () => {
    if (articles.length >= totalResults) return;
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, false, false);
    }
  };

  const onRefresh = () => {
    console.log("Refreshing news...");
    setRefreshing(true);
    setPage(1);
    fetchNews(1, true, true);
  };

  const onSearch = () => {
    Keyboard.dismiss();
    setPage(1);
    fetchNews(1, true, false);
  };

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.url)}
      activeOpacity={0.8}
    >
      {item.urlToImage ? (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "#888" }}>No Image</Text>
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.source}>{item.source.name}</Text>
          <Text style={styles.date}>
            {new Date(item.publishedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search news..."
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.url + index.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 120,
    height: 100,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  source: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
});
