describe('RunsConfig', () => {
  it('should have the expected properties', () => {
    const config: RunsConfig = {
      runs: [
        {
          type: 'model',
          model: 'gpt-3.5-turbo',
          prompt: '...'
        }
      ],
      dataset: {
        path: '...'
      },
      provider: 'openai',
      scorers: [
        {
          type: 'is-json'
        }
      ]
    };

    expect(config).toHaveProperty('runs');
    expect(config).toHaveProperty('dataset');
    expect(config).toHaveProperty('provider');
    expect(config).toHaveProperty('scorers');
  });
});