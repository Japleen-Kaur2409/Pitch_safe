import { configureDependencies, getDependencies } from '../../src/config/dependencies';

describe('dependencies', () => {
  describe('configureDependencies', () => {
    it('should create and return all dependencies', () => {
      const deps = configureDependencies();
      
      expect(deps).toBeDefined();
      expect(deps).toHaveProperty('authViewModel');
      expect(deps).toHaveProperty('playerViewModel');
      expect(deps).toHaveProperty('navigationViewModel');
      expect(deps).toHaveProperty('gameViewModel');
      expect(deps).toHaveProperty('mlViewModel');
    });

    it('should create all controllers', () => {
      const deps = configureDependencies();
      
      expect(deps).toHaveProperty('authController');
      expect(deps).toHaveProperty('playerController');
      expect(deps).toHaveProperty('navigationController');
      expect(deps).toHaveProperty('gameController');
      expect(deps).toHaveProperty('mlController');
    });

    it('should include mlbApiService', () => {
      const deps = configureDependencies();
      
      expect(deps).toHaveProperty('mlbApiService');
    });

    it('should cache dependencies on subsequent calls', () => {
      const deps1 = configureDependencies();
      const deps2 = configureDependencies();
      
      expect(deps1).toBe(deps2);
    });
  });

  describe('getDependencies', () => {
    it('should return cached dependencies', () => {
      const deps = getDependencies();
      
      expect(deps).toBeDefined();
      expect(deps).toHaveProperty('authController');
      expect(deps).toHaveProperty('playerController');
    });

    it('should return the same instance as configureDependencies', () => {
      const configuredDeps = configureDependencies();
      const retrievedDeps = getDependencies();
      
      expect(retrievedDeps).toBe(configuredDeps);
    });
  });

  describe('dependency wiring', () => {
    it('should wire up auth dependencies correctly', () => {
      const deps = configureDependencies();
      
      // These calls ensure the wiring code executes
      expect(deps.authController).toBeDefined();
      expect(deps.authViewModel).toBeDefined();
    });

    it('should wire up player dependencies correctly', () => {
      const deps = configureDependencies();
      
      expect(deps.playerController).toBeDefined();
      expect(deps.playerViewModel).toBeDefined();
    });

    it('should wire up game dependencies correctly', () => {
      const deps = configureDependencies();
      
      expect(deps.gameController).toBeDefined();
      expect(deps.gameViewModel).toBeDefined();
    });

    it('should wire up ML dependencies correctly', () => {
      const deps = configureDependencies();
      
      expect(deps.mlController).toBeDefined();
      expect(deps.mlViewModel).toBeDefined();
    });

    it('should wire up navigation dependencies correctly', () => {
      const deps = configureDependencies();
      
      expect(deps.navigationController).toBeDefined();
      expect(deps.navigationViewModel).toBeDefined();
    });
  });
});
