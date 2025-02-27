import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { getKeywordResponses, createKeywordResponse, updateKeywordResponse, deleteKeywordResponse } from '../lib/api';
import { getCurrentUser } from '../lib/supabase';
import { KeywordResponse } from '../types';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Download, Upload, AlertCircle } from 'lucide-react';

const KeywordResponsesPage: React.FC = () => {
  const [keywordResponses, setKeywordResponses] = useState<KeywordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<Partial<KeywordResponse>>({
    keyword: '',
    response: '',
    synonyms: [],
    regex_pattern: '',
    is_active: true,
    priority: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newSynonym, setNewSynonym] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate('/login');
          return;
        }
        
        setUserName(user.email?.split('@')[0] || 'User');
        setUserId(user.id);
        
        const responses = await getKeywordResponses(user.id);
        setKeywordResponses(responses);
      } catch (error) {
        console.error('Error fetching keyword responses:', error);
        setError('Failed to load keyword responses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);

  const handleAddSynonym = () => {
    if (newSynonym.trim() && !currentResponse.synonyms?.includes(newSynonym.trim())) {
      setCurrentResponse({
        ...currentResponse,
        synonyms: [...(currentResponse.synonyms || []), newSynonym.trim()]
      });
      setNewSynonym('');
    }
  };

  const handleRemoveSynonym = (synonym: string) => {
    setCurrentResponse({
      ...currentResponse,
      synonyms: currentResponse.synonyms?.filter(s => s !== synonym) || []
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCurrentResponse({
        ...currentResponse,
        [name]: checked
      });
    } else if (name === 'priority') {
      setCurrentResponse({
        ...currentResponse,
        [name]: parseInt(value, 10) || 0
      });
    } else {
      setCurrentResponse({
        ...currentResponse,
        [name]: value
      });
    }
  };

  const handleEdit = (response: KeywordResponse) => {
    setCurrentResponse(response);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this keyword response?')) {
      try {
        const success = await deleteKeywordResponse(id);
        
        if (success) {
          setKeywordResponses(keywordResponses.filter(response => response.id !== id));
          setSuccess('Keyword response deleted successfully!');
          
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        } else {
          throw new Error('Failed to delete keyword response');
        }
      } catch (error) {
        console.error('Error deleting keyword response:', error);
        setError('Failed to delete keyword response. Please try again.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!currentResponse.keyword || !currentResponse.response) {
        setError('Keyword and response are required.');
        return;
      }
      
      let result;
      
      if (currentResponse.id) {
        // Update existing response
        result = await updateKeywordResponse(currentResponse as KeywordResponse);
        
        if (result) {
          setKeywordResponses(keywordResponses.map(response => 
            response.id === result?.id ? result : response
          ));
          setSuccess('Keyword response updated successfully!');
        }
      } else {
        // Create new response
        const newResponse = {
          ...currentResponse,
          user_id: userId
        };
        
        result = await createKeywordResponse(newResponse as Omit<KeywordResponse, 'id' | 'created_at' | 'updated_at'>);
        
        if (result) {
          setKeywordResponses([...keywordResponses, result]);
          setSuccess('Keyword response created successfully!');
        }
      }
      
      if (result) {
        setIsEditing(false);
        setCurrentResponse({
          keyword: '',
          response: '',
          synonyms: [],
          regex_pattern: '',
          is_active: true,
          priority: 0
        });
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        throw new Error('Failed to save keyword response');
      }
    } catch (error) {
      console.error('Error saving keyword response:', error);
      setError('Failed to save keyword response. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentResponse({
      keyword: '',
      response: '',
      synonyms: [],
      regex_pattern: '',
      is_active: true,
      priority: 0
    });
    setError(null);
  };

  const exportToCSV = () => {
    if (keywordResponses.length === 0) {
      setError('No keyword responses to export.');
      return;
    }
    
    // Convert keyword responses to CSV format
    const headers = ['keyword', 'response', 'synonyms', 'regex_pattern', 'is_active', 'priority'];
    const csvContent = [
      headers.join(','),
      ...keywordResponses.map(response => [
        `"${response.keyword.replace(/"/g, '""')}"`,
        `"${response.response.replace(/"/g, '""')}"`,
        `"${(response.synonyms || []).join(';').replace(/"/g, '""')}"`,
        `"${(response.regex_pattern || '').replace(/"/g, '""')}"`,
        response.is_active,
        response.priority
      ].join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `keyword_responses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        // Validate headers
        const requiredHeaders = ['keyword', 'response'];
        const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
          setError(`Invalid CSV format. Missing headers: ${missingHeaders.join(', ')}`);
          return;
        }
        
        const newResponses: Omit<KeywordResponse, 'id' | 'created_at' | 'updated_at'>[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => {
            // Remove quotes and handle escaped quotes
            if (v.startsWith('"') && v.endsWith('"')) {
              return v.slice(1, -1).replace(/""/g, '"');
            }
            return v;
          });
          
          const response: any = {
            user_id: userId,
            is_active: true,
            priority: 0
          };
          
          headers.forEach((header, index) => {
            if (header === 'synonyms') {
              response[header] = values[index] ? values[index].split(';') : [];
            } else if (header === 'is_active') {
              response[header] = values[index] === 'true';
            } else if (header === 'priority') {
              response[header] = parseInt(values[index], 10) || 0;
            } else {
              response[header] = values[index] || '';
            }
          });
          
          if (response.keyword && response.response) {
            newResponses.push(response);
          }
        }
        
        if (newResponses.length === 0) {
          setError('No valid keyword responses found in the CSV file.');
          return;
        }
        
        // Create all new responses
        const createdResponses = [];
        for (const response of newResponses) {
          const result = await createKeywordResponse(response);
          if (result) {
            createdResponses.push(result);
          }
        }
        
        if (createdResponses.length > 0) {
          setKeywordResponses([...keywordResponses, ...createdResponses]);
          setSuccess(`Successfully imported ${createdResponses.length} keyword responses.`);
          
          setTimeout(() => {
            setSuccess(null);
          }, 3000);
        } else {
          setError('Failed to import keyword responses. Please try again.');
        }
      } catch (error) {
        console.error('Error importing CSV:', error);
        setError('Failed to import CSV. Please check the file format and try again.');
      }
      
      // Reset the file input
      e.target.value = '';
    };
    
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <Layout title="Keyword Responses" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Keyword Responses" userName={userName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Keyword Responses</h2>
            <p className="text-gray-600">
              Create automated responses based on keywords in visitor messages.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            
            <label className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Response
            </button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-md">
            {success}
          </div>
        )}
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {currentResponse.id ? 'Edit Keyword Response' : 'Add Keyword Response'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                    Keyword
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    name="keyword"
                    value={currentResponse.keyword}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The main keyword to match in visitor messages.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={currentResponse.priority}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Higher priority responses are matched first (0-100).
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                    Response
                  </label>
                  <textarea
                    id="response"
                    name="response"
                    rows={4}
                    value={currentResponse.response}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    The response to send when the keyword is matched.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="synonyms" className="block text-sm font-medium text-gray-700">
                    Synonyms
                  </label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      id="synonyms"
                      value={newSynonym}
                      onChange={(e) => setNewSynonym(e.target.value)}
                      className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Add synonym"
                    />
                    <button
                      type="button"
                      onClick={handleAddSynonym}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-r-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentResponse.synonyms?.map((synonym, index) => (
                      <div
                        key={index}
                        className="flex items-center px-2 py-1 text-sm bg-indigo-100 rounded-md"
                      >
                        <span className="text-indigo-800">{synonym}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSynonym(synonym)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Alternative words or phrases that should trigger the same response.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="regex_pattern" className="block text-sm font-medium text-gray-700">
                    Regex Pattern (Optional)
                  </label>
                  <input
                    type="text"
                    id="regex_pattern"
                    name="regex_pattern"
                    value={currentResponse.regex_pattern || ''}
                    onChange={handleChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Advanced: A regular expression pattern to match more complex phrases.
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={currentResponse.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="is_active" className="block ml-2 text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    When disabled, this response will not be used.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {currentResponse.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Synonyms
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {keywordResponses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No keyword responses found. Click "Add Response" to create one.
                    </td>
                  </tr>
                ) : (
                  keywordResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {response.keyword}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {response.response}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {response.synonyms && response.synonyms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {response.synonyms.slice(0, 3).map((synonym, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                {synonym}
                              </span>
                            ))}
                            {response.synonyms.length > 3 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                                +{response.synonyms.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          response.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {response.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(response)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(response.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default KeywordResponsesPage;