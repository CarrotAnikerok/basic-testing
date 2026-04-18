// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 5;
    const account = getBankAccount(balance);

    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 5;
    const account = getBankAccount(balance);

    expect(() => account.withdraw(balance + 1)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const balance = 5;
    const account = getBankAccount(balance);
    const targetAccount = getBankAccount(balance);

    expect(() => account.transfer(balance + 1, targetAccount)).toThrow(Error);
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 5;
    const account = getBankAccount(balance);

    expect(() => account.transfer(balance + 1, account)).toThrow(Error);
  });

  test('should deposit money', () => {
    const balance = 5;
    const depositSum = 3;
    const account = getBankAccount(balance);

    account.deposit(depositSum);

    expect(account.getBalance()).toBe(balance + depositSum);
  });

  test('should withdraw money', () => {
    const balance = 5;
    const withdrawSum = 3;
    const account = getBankAccount(balance);

    account.withdraw(withdrawSum);

    expect(account.getBalance()).toBe(balance - withdrawSum);
  });

  test('should transfer money', () => {
    const accountBalance = 5;
    const targetAccountBalance = 6;
    const transferSum = 3;

    const account = getBankAccount(accountBalance);
    const targetAccount = getBankAccount(targetAccountBalance);

    account.transfer(transferSum, targetAccount);

    expect(account.getBalance()).toBe(accountBalance - transferSum);
    expect(targetAccount.getBalance()).toBe(targetAccountBalance + transferSum);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = 5;
    const account = getBankAccount(balance);
    const fetchSpy = jest.spyOn(account, 'fetchBalance').mockResolvedValue(42);

    const result = await account.fetchBalance();

    expect(typeof result).toBe('number');
    expect(fetchSpy).toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = 5;
    const expectedBalance = 50;
    const account = getBankAccount(balance);
    const fetchSpy = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(expectedBalance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(expectedBalance);
    expect(fetchSpy).toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const balance = 5;
    const account = getBankAccount(balance);
    const fetchSpy = jest
      .spyOn(account, 'fetchBalance')
      .mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toBeInstanceOf(
      SynchronizationFailedError,
    );
    expect(fetchSpy).toHaveBeenCalled();

    fetchSpy.mockRestore();
  });
});
