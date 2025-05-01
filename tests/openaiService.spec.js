const axios = require('axios');
const { askOpenAI } = require('../src/services/openaiService');
const { afterEach, beforeEach, describe, it, expect } = require('@jest/globals');

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
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        }
      })
    );
  });

  it('should throw a formatted error if the API returns an error response', async () => {
    postSpy.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error: {
            message: 'Invalid request',
          }
        }
      }
    });

    await expect(askOpenAI()).rejects.toThrow('Invalid request');
  });

  it('should throw a generic error if no response is available', async () => {
    postSpy.mockRejectedValue(new Error('Network failure'));

    await expect(askOpenAI()).rejects.toThrow('Erro inesperado na API OpenAI');
  });
});
