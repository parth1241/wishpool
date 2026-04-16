// tests/wishValidation.test.ts
function validateWishInput(input: any) {
  if (!input.title) return "Title is required";
  if (input.title.length > 80) return "Title too long";
  if (input.targetAmount < 1) return "Target must be at least 1 XLM";
  if (new Date(input.deadline) <= new Date()) return "Deadline must be in the future";
  return null;
}

describe('Wish Input Validation Logic', () => {
  test('returns error for empty title', () => {
    const input = { title: '', description: 'Desc', targetAmount: 10, deadline: '2099-01-01' };
    expect(validateWishInput(input)).toBe("Title is required");
  });

  test('returns error for title over 80 chars', () => {
    const input = { title: 'A'.repeat(81), description: 'Desc', targetAmount: 10, deadline: '2099-01-01' };
    expect(validateWishInput(input)).toBe("Title too long");
  });

  test('returns error for targetAmount less than 1', () => {
    const input = { title: 'My Wish', description: 'Desc', targetAmount: 0, deadline: '2099-01-01' };
    expect(validateWishInput(input)).toBe("Target must be at least 1 XLM");
  });

  test('returns error for past deadline', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const input = { title: 'My Wish', description: 'Desc', targetAmount: 10, deadline: pastDate };
    expect(validateWishInput(input)).toBe("Deadline must be in the future");
  });

  test('returns null for valid input', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    const input = { title: 'Valid Wish', description: 'Desc', targetAmount: 10, deadline: futureDate };
    expect(validateWishInput(input)).toBeNull();
  });
});
