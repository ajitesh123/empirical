import asyncio
import httpx
import os

async def test_execute_success():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    result = await execute(inputs, parameters)
    assert "value" in result
    assert isinstance(result["value"], str)
    assert "helpful assistant" in result["value"]

async def test_execute_llama_cloud_error():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    with httpx.AsyncClient() as client:
        client.get = MagicMock(side_effect=httpx.HTTPStatusError("HTTP error"))
        result = await execute(inputs, parameters)
    assert "error" in result
    assert "HTTP error occurred" in result["error"]

async def test_execute_cohere_error():
    inputs = {"question": "What is the purpose of this example?"}
    parameters = {}
    with httpx.AsyncClient() as client:
        client.post = MagicMock(side_effect=httpx.RequestError("Request error"))
        result = await execute(inputs, parameters)
    assert "error" in result
    assert "An error occurred while requesting" in result["error"]