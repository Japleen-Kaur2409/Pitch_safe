import { getTeamAbbreviation, getTeamLogo } from '../../src/utils/teamUtils';

describe('Team Utils', () => {
  describe('getTeamAbbreviation', () => {
    const testCases = [
      { team: 'Toronto Blue Jays', expected: 'tor' },
      { team: 'New York Yankees', expected: 'nyy' },
      { team: 'Boston Red Sox', expected: 'bos' },
      { team: 'Unknown Team', expected: 'mlb' }
    ];

    testCases.forEach(({ team, expected }) => {
      it(`should return ${expected} for ${team}`, () => {
        expect(getTeamAbbreviation(team)).toBe(expected);
      });
    });
  });

  describe('getTeamLogo', () => {
    it('should return ESPN logo URL', () => {
      const logo = getTeamLogo('Toronto Blue Jays');

      expect(logo).toContain('espncdn.com');
      expect(logo).toContain('tor');
    });

    it('should handle unknown team', () => {
      const logo = getTeamLogo('Unknown Team');

      expect(logo).toContain('mlb');
    });
  });
});
