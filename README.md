# Resume Match Studio

Resume Match Studio is a small web product that helps users turn their work experience into polished resume bullet points. Users can paste a job description, enter their own experience, generate resume bullets, and analyze which job keywords match their background.

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser localStorage for simple data saving

## Live Site

Paste your deployed link here after publishing:

`https://your-site-name.pages.dev`

## Main Features

- Resume bullet generator based on user input
- Job description keyword scanner
- Match score calculation
- Copy button for generated bullets
- Save button using localStorage
- Clear button to reset the form

## How It Works

The user fills out a form with a target role, work experience, and a job description. JavaScript reads the text, looks for common workplace keywords, generates resume-style bullet points, and calculates a match score based on how many job description keywords appear in the user's experience.

## Technical Challenge

One technical challenge was making the app generate bullets that sounded polished while still using the user's own words. The solution was to combine action verbs, the user's experience phrases, and keywords found in the job description.

## One Thing I Would Improve

In the future, I would connect the app to an AI API so the bullet points could be more personalized and specific to different industries.

## Deployment

This project can be deployed on Cloudflare Pages, Vercel, or Netlify as a static website.
