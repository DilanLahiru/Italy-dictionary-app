import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {BaseUrl, API_PATH} from '../../utils/BaseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WordState {
  words: object | null;
  categories: any[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: WordState = {
  words: null,
  categories: null,
  loading: false,
  error: null,
};

export const getCategories = createAsyncThunk(
  'word/getCategories',
  async (_, {rejectWithValue}) => {
    try {
      // let token = await AsyncStorage.getItem('authToken');

      // if (!token) {
      //   return rejectWithValue('No authentication token found');
      // }
      const authHeader = `Bearer ${'2bbeb659f632d4dac5682205ceb8a6a683db595e7c38577b9ee33c8e16bdbf0cb766cc9f2f11894f114eacb4719d732d8e202b8fcc8576271b39ee35f2a206c8f2d1410446c09cee77199c1cfdbfed2b23c6bb8123a283c98bbd53320846c49fe3c472f5ff475b170e606539196341ceca8ff5bc03108924f5ae88079eb599c7'}`;

      // Handle token that might be JSON stringified
      // try {
      //   token = JSON.parse(token);
      // } catch (e) {
      //   // Token is already a plain string, not JSON
      // }

      const response = await BaseUrl.get(API_PATH.WORDS.GET_CATEGORIES, {
        params: {
          populate: '*',
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authHeader}`,
        },
      });

      console.log('Categories fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('Error fetching categories:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// export const getAllWords = createAsyncThunk('word/getAllWords', async (_, {rejectWithValue}) => {
//   try {
//     let token = await AsyncStorage.getItem('authToken');
//     console.log('====================================');
//     console.log('Token retrieved:', token);
//     console.log('====================================');

//     if (!token) {
//       return rejectWithValue('No authentication token found');
//     }

//     // Handle token that might be JSON stringified
//     try {
//       token = JSON.parse(token);
//     } catch (e) {
//       // Token is already a plain string, not JSON
//     }

//     const response = await BaseUrl.get(`${API_PATH.WORDS.GET_ALL}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log(response.data);
//     return response.data;
//   } catch (error: any) {
//     console.log('Error fetching all words:', error);
//     return rejectWithValue(error.response?.data || error.message);
//   }
// });

export const getAllWords = createAsyncThunk(
  'word/getAllWords',
  async (_, {rejectWithValue}) => {
    try {
      let token = await AsyncStorage.getItem('authToken');
      console.log('Raw token from storage:', token);

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Handle token that might be JSON stringified
      try {
        const parsed = JSON.parse(token);
        token = parsed;
        console.log('Token was JSON, parsed:', token);
      } catch (e) {
        console.log('Token is plain string:', token);
      }

      // Log the final Authorization header value
      const authHeader = `Bearer ${'2bbeb659f632d4dac5682205ceb8a6a683db595e7c38577b9ee33c8e16bdbf0cb766cc9f2f11894f114eacb4719d732d8e202b8fcc8576271b39ee35f2a206c8f2d1410446c09cee77199c1cfdbfed2b23c6bb8123a283c98bbd53320846c49fe3c472f5ff475b170e606539196341ceca8ff5bc03108924f5ae88079eb599c7'}`;
      console.log('Authorization header:', authHeader);

      const response = await BaseUrl.get(`${API_PATH.WORDS.GET_ALL}`, {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      console.log('====================================');
      console.log(response);
      console.log('====================================');

      return response.data;
    } catch (error: any) {
      console.log('Error fetching all words:', error);
      console.log('Error response:', error.response?.data);
      console.log('Error status:', error.response?.status);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getWordsByCategory = createAsyncThunk(
  'word/getWordsByCategory',
  async (category: string, {rejectWithValue}) => {
    try {
      let token = await AsyncStorage.getItem('authToken');

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Handle token that might be JSON stringified
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Token is already a plain string, not JSON
      }

      const response = await BaseUrl.get(API_PATH.WORDS.GET_BY_CATEGORY, {
        params: {
          'filters[categories][$eq]': category,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log('Error fetching words by category:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const getWordById = createAsyncThunk(
  'word/getWordById',
  async (id: string, {rejectWithValue}) => {
    try {
      let token = await AsyncStorage.getItem('authToken');

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Handle token that might be JSON stringified
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Token is already a plain string, not JSON
      }

      const response = await BaseUrl.get(
        `${API_PATH.WORDS.GET_BY_ID}`.replace(':id', id),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.log('Error fetching word by ID:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const searchWords = createAsyncThunk(
  'word/searchWords',
  async (payload: { query: string; language: string }, {rejectWithValue}) => {
    try {
      const { query: searchQuery, language } = payload;
      
      const authHeader = `Bearer ${'2bbeb659f632d4dac5682205ceb8a6a683db595e7c38577b9ee33c8e16bdbf0cb766cc9f2f11894f114eacb4719d732d8e202b8fcc8576271b39ee35f2a206c8f2d1410446c09cee77199c1cfdbfed2b23c6bb8123a283c98bbd53320846c49fe3c472f5ff475b170e606539196341ceca8ff5bc03108924f5ae88079eb599c7'}`;

      console.log('Searching for:', searchQuery, 'in language:', language);
      
      // Map language to field name
      const fieldMap: Record<string, string> = {
        'Italy': 'Italy_word',
        'English': 'English_word',
        'Sinhala': 'Sinhala_word',
      };
      
      const fieldName = fieldMap[language] || 'Italy_word'; // Default to Italy_word
      
      // Build dynamic filter based on selected language
      const params: any = {
        [`filters[${fieldName}][$containsi]`]: searchQuery,
        'populate': '*',
      };
      
      console.log('Search params:', params);
      
      const response = await BaseUrl.get(API_PATH.WORDS.SEARCH, {
        params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      });
      console.log('Search results:', response.data);
      return response.data;
    } catch (error: any) {
      console.log('Search error:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const wordSlice = createSlice({
  name: 'word',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Get Categories
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.data || action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All Words
    builder.addCase(getAllWords.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(getWordsByCategory.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(getWordById.fulfilled, (state, action) => {
      state.words = action.payload;
    });
    builder.addCase(searchWords.fulfilled, (state, action) => {
      state.words = action.payload;
    });
  },
});

export default wordSlice.reducer;
