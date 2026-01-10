import mongoose from 'mongoose';
import connectDB from '../../../config/db';

jest.mock('mongoose');

describe('Database Connection', () => {
  // We need to mock process.exit so it doesn't kill the test runner
  const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
    return undefined as never; 
  });

  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should exit with 1 when connection fails', async () => {
    // 1. Arrange: Force mongoose.connect to throw an error
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Connection failed'));

    // 2. Act: Call the function
    await connectDB();

    // 3. Assert: Check if process.exit(1) was called
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalled();
  });
  it('should successfully connect to MongoDB and log the host', async () => {
    // 1. Setup the Mock Connection Object
    const mockConnection = {
        connection: { host: 'localhost' }
    };
    
    // 2. Force the mocked mongoose.connect to resolve with our object
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(mockConnection);

    // 3. Spy on console.log BEFORE calling the function
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // 4. Act
    await connectDB();

    // 5. Assert
    expect(mongoose.connect).toHaveBeenCalled();
    
    // Use a simpler string check to see if it's being called AT ALL
    expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB Connected') 
    );
    
    expect(mockExit).not.toHaveBeenCalled();

    // 6. Clean up
    consoleLogSpy.mockRestore();
    });
});