import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@merawardrobe/state";

const DEFAULT_STATE = {
  userTier: "FREE",
  maxStorage: 10,
  aiCredits: 1,
  clothesList: [],
};

const AppContext = createContext(null);

function generateGarmentId(category) {
  const year = new Date().getFullYear();
  const initials = (category || "PC")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, "X");
  const suffix = Math.floor(10 + Math.random() * 90);
  return `MW-${year}-${initials}${suffix}`;
}

export function AppProvider({ children }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const [isReady, setIsReady] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch (err) {
        console.warn("[AppContext] failed to hydrate state:", err.message);
      } finally {
        hasHydrated.current = true;
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((err) =>
      console.warn("[AppContext] failed to persist state:", err.message)
    );
  }, [state]);

  const actions = useMemo(
    () => ({
      addClothingItem(item) {
        setState((prev) => {
          if (prev.clothesList.length >= prev.maxStorage) return prev;
          const newItem = {
            id: generateGarmentId(item.category),
            name: item.name || "Untitled Piece",
            category: item.category || "Uncategorized",
            color: item.color || "Undyed",
            season: item.season || "All Season",
            composition: item.composition || "Composition not specified",
            imageUri: item.imageUri || null,
            wearCount: 0,
            dateAdded: new Date().toISOString(),
          };
          return { ...prev, clothesList: [newItem, ...prev.clothesList] };
        });
      },
      removeClothingItem(id) {
        setState((prev) => ({
          ...prev,
          clothesList: prev.clothesList.filter((item) => item.id !== id),
        }));
      },
      incrementWearCount(id) {
        setState((prev) => ({
          ...prev,
          clothesList: prev.clothesList.map((item) =>
            item.id === id ? { ...item, wearCount: item.wearCount + 1 } : item
          ),
        }));
      },
      deductCredit() {
        setState((prev) => ({ ...prev, aiCredits: Math.max(0, prev.aiCredits - 1) }));
      },
      applyMicroTopUp() {
        setState((prev) => ({ ...prev, aiCredits: prev.aiCredits + 5 }));
      },
      applyInfiniteStyle() {
        setState((prev) => ({
          ...prev,
          userTier: "INFINITE",
          maxStorage: 20,
          aiCredits: 15,
        }));
      },
    }),
    []
  );

  const value = useMemo(() => ({ ...state, isReady, ...actions }), [state, isReady, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within an AppProvider");
  return ctx;
}
