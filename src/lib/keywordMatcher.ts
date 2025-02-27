import stringSimilarity from 'string-similarity';
import { KeywordResponse } from '../types';

export interface MatchResult {
  matched: boolean;
  response: string | null;
  confidence: number;
  matchType: 'exact' | 'fuzzy' | 'regex' | 'synonym' | 'none';
  keywordId?: string;
}

export function matchKeyword(
  message: string, 
  keywords: KeywordResponse[]
): MatchResult {
  // Normalize the message
  const normalizedMessage = message.toLowerCase().trim();
  
  // Sort keywords by priority if available
  const sortedKeywords = [...keywords].sort((a, b) => 
    (b.priority || 0) - (a.priority || 0)
  );
  
  // Check for exact matches first
  for (const item of sortedKeywords) {
    if (normalizedMessage === item.keyword.toLowerCase()) {
      return {
        matched: true,
        response: item.response,
        confidence: 1,
        matchType: 'exact',
        keywordId: item.id
      };
    }
  }
  
  // Check for regex matches
  for (const item of sortedKeywords) {
    if (item.regex_pattern) {
      try {
        const regex = new RegExp(item.regex_pattern, 'i');
        if (regex.test(normalizedMessage)) {
          return {
            matched: true,
            response: item.response,
            confidence: 0.9,
            matchType: 'regex',
            keywordId: item.id
          };
        }
      } catch (error) {
        console.error('Invalid regex pattern:', item.regex_pattern, error);
      }
    }
  }
  
  // Check for synonyms
  for (const item of sortedKeywords) {
    if (item.synonyms && item.synonyms.length > 0) {
      for (const synonym of item.synonyms) {
        if (normalizedMessage === synonym.toLowerCase()) {
          return {
            matched: true,
            response: item.response,
            confidence: 0.95,
            matchType: 'synonym',
            keywordId: item.id
          };
        }
      }
    }
  }
  
  // Check for fuzzy matches
  let bestMatch = {
    keyword: '',
    response: '',
    similarity: 0,
    keywordId: ''
  };
  
  for (const item of sortedKeywords) {
    const similarity = stringSimilarity.compareTwoStrings(
      normalizedMessage,
      item.keyword.toLowerCase()
    );
    
    if (similarity > bestMatch.similarity && similarity > 0.7) {
      bestMatch = {
        keyword: item.keyword,
        response: item.response,
        similarity,
        keywordId: item.id
      };
    }
    
    // Also check synonyms for fuzzy matching
    if (item.synonyms && item.synonyms.length > 0) {
      for (const synonym of item.synonyms) {
        const synSimilarity = stringSimilarity.compareTwoStrings(
          normalizedMessage,
          synonym.toLowerCase()
        );
        
        if (synSimilarity > bestMatch.similarity && synSimilarity > 0.7) {
          bestMatch = {
            keyword: synonym,
            response: item.response,
            similarity: synSimilarity,
            keywordId: item.id
          };
        }
      }
    }
  }
  
  if (bestMatch.similarity > 0) {
    return {
      matched: true,
      response: bestMatch.response,
      confidence: bestMatch.similarity,
      matchType: 'fuzzy',
      keywordId: bestMatch.keywordId
    };
  }
  
  // No match found
  return {
    matched: false,
    response: null,
    confidence: 0,
    matchType: 'none'
  };
}

// Track keyword usage for analytics
export function trackKeywordUsage(keywordId: string, userId: string) {
  try {
    // In a real implementation, this would send data to your analytics system
    // For now, we'll just log it
    console.log(`Keyword ${keywordId} used by user ${userId}`);
    
    // You could store this in localStorage for demo purposes
    const keywordUsage = JSON.parse(localStorage.getItem('keyword_usage') || '{}');
    if (!keywordUsage[keywordId]) {
      keywordUsage[keywordId] = 0;
    }
    keywordUsage[keywordId]++;
    localStorage.setItem('keyword_usage', JSON.stringify(keywordUsage));
    
    return true;
  } catch (error) {
    console.error('Error tracking keyword usage:', error);
    return false;
  }
}