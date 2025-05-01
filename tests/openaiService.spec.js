const axios = require('axios');
const { askOpenAI } = require('../src/services/openaiService');
const { afterEach, beforeEach } = require('@jest/globals');


describe('askOpenAI', () => {

  let postSpy;

  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post');
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a mocked response and timestamp', async () => {
    const mockMessage = '[{"word":"eloquent","description":"fluent or persuasive in speaking","useCase":"She gave an eloquent speech."}]';

    // Proper way to mock axios.post
    postSpy.mockResolvedValue({
      data: {
        choices: [
          { message: { content: mockMessage } }
        ]
      }
    });

    const result = await askOpenAI();

    expect(result.answer).toBe(mockMessage);
    expect(result).toHaveProperty('timestamp');
    expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');

    expect(postSpy).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.any(Object),
      expect.objectContaining({
        headers: {
          Authorization: `Bearer test-key`,
        }
      })
    );
  });

  it('should throw an error if the API fails', async () => {
    postSpy.mockRejectedValue(new Error('API failure'));

    await expect(askOpenAI()).rejects.toThrow('API failure');
  });
});