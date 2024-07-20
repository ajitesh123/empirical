describe('handleRunCommand', () => {
  it('should load the configuration file and parse the runs, dataset, provider, and scorers correctly', async () => {
    const mockData = `{
      "runs": [
        {
          "type": "model",
          "model": "gpt-3.5-turbo",
          "prompt": "..."
        }
      ],
      "dataset": {
        "path": "..."
      },
      "provider": "openai",
      "scorers": [
        {
          "type": "is-json"
        }
      ]
    }`;
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockData);

    await handleRunCommand(configFileName);

    expect(runs).toEqual([
      {
        type: 'model',
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        prompt: '...'
      }
    ]);
    expect(datasetConfig).toEqual({ path: '...' });
    expect(provider).toBe('openai');
    expect(scorers).toEqual([
      {
        type: 'is-json'
      }
    ]);
  });

  it('should use the provider and scorers from the config if they are not defined in the run', async () => {
    const mockData = `{
      "runs": [
        {
          "type": "model",
          "model": "gpt-3.5-turbo",
          "prompt": "..."
        }
      ],
      "provider": "openai",
      "scorers": [
        {
          "type": "is-json"
        }
      ]
    }`;
    jest.spyOn(fs, 'readFileSync').mockReturnValue(mockData);

    await handleRunCommand(configFileName);

    expect(runs[0]).toEqual({
      type: 'model',
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      prompt: '...',
      scorers: [
        {
          type: 'is-json'
        }
      ]
    });
  });
});