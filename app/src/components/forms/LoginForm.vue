<template>
  <main class="login-form">
    <div class="form-container">
      <h2>Welcome Back!</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" id="email" placeholder="Enter your email address" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" class="btn-login">Log In</button>
      </form>
      <div class="form-footer">
        <a href="#">Forgot your password?</a>
        <p>Don't have an account? <a href="#">Join us!</a></p>
      </div>
    </div>
  </main>
</template>
