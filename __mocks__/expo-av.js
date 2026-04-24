module.exports = {
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: { playAsync: jest.fn(), stopAsync: jest.fn(), unloadAsync: jest.fn() },
      }),
    },
  },
};