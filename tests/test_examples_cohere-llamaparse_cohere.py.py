import requests
import os
from unittest.mock import patch

def test_execute_success():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    with patch('requests.get') as mock_get, patch('requests.post') as mock_post:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'markdown': 'Sample document content'}
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {'text': 'Helpful assistant response'}
        result = execute(inputs, parameters)
    assert "value" in result
    assert isinstance(result["value"], str)
    assert "Helpful assistant response" in result["value"]

def test_execute_llama_cloud_timeout():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    with patch('requests.get') as mock_get:
        mock_get.side_effect = requests.Timeout
        result = execute(inputs, parameters)
    assert "error" in result
    assert "Request timed out" in result["error"]

def test_execute_cohere_error():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    with patch('requests.get') as mock_get, patch('requests.post') as mock_post:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {'markdown': 'Sample document content'}
        mock_post.side_effect = requests.RequestException("Request error")
        result = execute(inputs, parameters)
    assert "error" in result
    assert "An error occurred" in result["error"]