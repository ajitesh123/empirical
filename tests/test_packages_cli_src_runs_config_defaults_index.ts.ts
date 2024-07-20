describe('default config', () => {
  it('should have the expected structure', () => {
    expect(config).toEqual({
      $schema: 'https://assets.empirical.run/config/schema/latest.json',
      provider: 'openai',
      runs: [
        {
          type: 'model',
          model: 'gpt-3.5-turbo',
          prompt: expect.any(String)
        },
        {
          type: 'model',
          model: 'gpt-4-turbo-preview',
          prompt: expect.any(String)
        }
      ],
      scorers: [
        {
          type: 'is-json'
        }
      ],
      dataset: {
        samples: expect.any(Array)
      }
    });
  });
});