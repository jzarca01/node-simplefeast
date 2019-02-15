const axios = require('axios');
const faker = require('faker');

class SimpleFeast {
  constructor() {
    this.request = axios.create({
      baseURL: 'https://api.simplefeast.com/api',
      headers: {}
    });
  }

  setAccessToken(accessToken) {
    this.request.defaults.headers.common['authToken'] = '';
    delete this.request.defaults.headers.common['authToken'];

    this.request.defaults.headers.common['authToken'] = `${accessToken}`;
  }

  async createSession() {
    try {
      const session = await this.request({
        method: 'POST',
        url: '/registerUser',
        data: {
          action: 'REFRESH',
          app: 'Simple Feast',
          appBuild: 56,
          appOpens: 1,
          appPackageName: 'com.simplefeast.android.app',
          appVersion: '2.5.0',
          brand: faker.random.word(),
          call: 1,
          country: 'FR',
          deviceUuid: faker.random.uuid(),
          didRefuseReview: false,
          didReview: false,
          model: 'A0001',
          os: (Math.random() * 1000) % 2 === 0 ? 'iOS' : 'Android',
          osVersion: faker.system.semver(),
          premium: true,
          recipeLanguage: 'FR',
          recipesLiked: 0,
          recipesShopped: 0,
          reviewPromptsShown: 0,
          userUuid: faker.random.uuid(),
          vendor: faker.random.word()
        }
      });
      const { authToken } = session.data;
      this.setAccessToken(authToken);
    } catch (err) {
      console.log('error with createSession', err);
    }
  }

  async getRecipes() {
    try {
      const recipes = await this.request({
        method: 'POST',
        url: '/sync',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          appBuild: 56,
          feedRev: 0,
          lastSyncedAppBuild: 0,
          polyFeedRev: 0,
          recipeUserDataRev: 0,
          rev: 220524,
          subRev: 0,
          v: 4
        }
      });
      const { globalChanges } = recipes.data;
      return globalChanges.filter(item => item.type === 'Recipe');
    } catch (err) {
      console.log('error with getRecipes', err);
    }
  }

  async getIngredients() {
    try {
      const recipes = await this.request({
        method: 'POST',
        url: '/sync',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          appBuild: 56,
          feedRev: 0,
          lastSyncedAppBuild: 0,
          polyFeedRev: 0,
          recipeUserDataRev: 0,
          rev: 220524,
          subRev: 0,
          v: 4
        }
      });
      const { globalChanges } = recipes.data;
      return globalChanges.filter(item => item.type === 'Ingredient');
    } catch (err) {
      console.log('error with getIngredients', err);
    }
  }

  async getIngredientById(ingredientId) {
    try {
      const ingredients = await this.getIngredients();
      return ingredients
        .map(ingredient => ingredient.value)
        .find(ingredient => ingredient.uuid === ingredientId);
    } catch (err) {
      console.log('error with getIngredientById', err);
    }
  }

  async getRecipeById(recipeId) {
    try {
      const recipes = await this.getRecipes();
      return recipes
        .map(recipe => recipe.value)
        .find(recipe => recipe.uuid === recipeId);
    } catch (err) {
      console.log('error with getRecipeById', err);
    }
  }

  async findInRecipes(searchTerm) {
    try {
      const recipes = await this.getRecipes();
      return recipes
        .filter(recipe => recipe.value)
        .map(recipe => recipe.value)
        .filter(recipe =>
          JSON.stringify(Object.values(recipe)).includes(searchTerm)
        );
    } catch (err) {
      console.log('error with getRecipes', err);
    }
  }
}

module.exports = SimpleFeast;
