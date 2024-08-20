async def execute(inputs, parameters):
    client = httpx.AsyncClient()
    try:
        response = await client.get(
          'https://api.cloud.llamaindex.ai/api/parsing/job/4763f2d1-5fe5-434e-abb7-b18b3e8d2577/result/markdown',
          headers={
            'accept': 'application/json',
            'Authorization': f'Bearer {os.environ.get("LLAMA_CLOUD_API_KEY", "")}'
          }
        )
        response.raise_for_status()
                try:
                    parsed_response = response.json()
                    doc_content = parsed_response['markdown']
                except ValueError as e:
                    return {"error": f"Failed to parse JSON response: {str(e)}"}
                except KeyError as e:
                    return {"error": f"Expected key 'markdown' not found in response: {str(e)}"}
        
        response = await client.post(
            'https://api.cohere.ai/v1/chat',
            timeout=30.0,
            headers={
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {os.environ.get("CO_API_KEY", "")}'
            },
            json={
                "preamble": "You are a helpful assistant for a gaming payments company that connects merchants (gaming apps) with their users. Users pay on the gaming apps, and this company processes their payments\n\nUsers need help regarding their transactions and have questions that they will ask you. You need to represent this company and their merchant, and talk to the user in a helpful and polite tone.\n\nUse the documents that you have to find answers, instead of jumping to answer the question yourself.",
                "message": inputs["question"],
                "documents": [{"title": "Client Operations.pdf", "text": doc_content}],
            }
        )
        response.raise_for_status()
        result = response.json()
        return {
            "value": result["text"]
        }
    except httpx.HTTPStatusError as e:
        return {"error": f"HTTP error occurred: {e}"}
    except httpx.RequestError as e:
        return {"error": f"An error occurred while requesting: {e}"}
    finally:
        await client.aclose()
