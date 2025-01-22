<template>
    <main class="login-form" style="display: flex; justify-content: center; align-items: center; flex: 1; padding: 1rem;">
      <div class="form-container" style="background-color: #ffffff; padding: 2rem; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; text-align: center; ">
        <h2 style="font-size: 1.2rem; margin-bottom: 1rem;">Welcome Back!</h2>
        <form>
          <div class="form-group" style="margin-bottom: 1rem; text-align: left;">
            <label for="email" style="display: block; font-weight: bold; margin-bottom: 0.5rem;">Email</label>
            <input type="email" id="email" placeholder="Enter your email address" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" />
          </div>
          <div class="form-group" style="margin-bottom: 1rem; text-align: left;">
            <label for="password" style="display: block; font-weight: bold; margin-bottom: 0.5rem;">Password</label>
            <input type="password" id="password" placeholder="Enter your password" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;" />
          </div>
          <button type="submit" class="btn-login" style="background-color: #4a6cf7; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; font-size: 1rem; cursor: pointer; width: 100%; margin-top: 0.5rem; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">Log In</button>
        </form>
        <div class="form-footer" style="margin-top: 1rem; font-size: 0.875rem; color: #888;">
          <a href="#" style="color: #4a6cf7; text-decoration: none;">Forgot your password?</a>
          <p style="margin-top: 0.5rem;">Don’t you have an account? <a href="#" style="color: #4a6cf7; text-decoration: none;">Join us!</a></p>
        </div>
      </div>
    </main>
</template>