# HireMe Match Studio

HireMe Match Studio is a small web product that helps users find job openings and improve their resume bullets. Users can enter a job title, location, and keywords to launch targeted searches on LinkedIn, ZipRecruiter, and Google Jobs. They can also paste a job description, enter their experience, generate multiple resume bullets, and analyze which job keywords match their background.

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser localStorage for simple data saving
- External job-search links generated from user input

## Live Site

Paste your deployed link here after publishing:

`https://your-site-name.pages.dev`

## Main Features

- Job search launcher for LinkedIn, ZipRecruiter, and Google Jobs
- Remote job search button
- Resume bullet generator with multiple bullet styles
- User choice of 5, 7, or 10 resume bullets
- Job description keyword scanner
- Match score calculation
- Copy button for generated bullets
- Save button using localStorage
- Clear button to reset the form

## How It Works

The user fills out a job search form with a role, location, and optional keywords. JavaScript turns that input into search URLs and opens external job-search results. The user can also fill out the resume form with a target role, work experience, and job description. JavaScript scans the text for common workplace keywords, generates resume-style bullet points, and calculates a match score based on how many job description keywords appear in the user's experience.

## Technical Challenge

One technical challenge was making the app feel connected to real job boards while keeping it simple enough to deploy as a static website. Instead of using private job-board APIs, the app dynamically builds search links that send users to live LinkedIn, ZipRecruiter, and Google Jobs searches.

## One Thing I Would Improve

In the future, I would connect the app to a real jobs API or an AI API so it could pull job listings directly into the page and generate even more personalized bullet points.

## Deployment

This project can be deployed on Cloudflare Pages, Vercel, or Netlify as a static website.
