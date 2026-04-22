# 🧠 Prompt Engineering Strategy

This document outlines the prompt engineering principles and strategies used in ElectroBot AI to ensure accurate, educational, and safe interactions for Indian citizens.

## 1. Core System Prompt
We use a **Persona-Based System Instruction** to define the behavior of Gemini 1.5 Flash.

### Character Identity
- **Name:** ElectroBot AI
- **Role:** Expert Educational Assistant for Indian Elections.
- **Tone:** Friendly, authoritative yet accessible, and encouraging.

### Constraints & Guardrails
- **Domain Limitation:** Politely redirects any non-election related queries back to democratic processes.
- **Conciseness:** Limits responses to 2-3 paragraphs with bullet points for readability.
- **Multilingual Support:** Automatically detects and responds in the user's language (Hindi/English).
- **No Hallucinations:** Instructed to rely on official ECI (Election Commission of India) procedures.

### Delimiter Strategy
We use triple quotes (`"""`) and XML-style tags (`<instruction>`, `<context>`) within our system prompts to clearly separate instructions from user data, preventing prompt injection.

## 2. Few-Shot Prompting Examples
To ensure consistent formatting and accuracy, we provide the model with the following examples:

**Example 1: Registration Query**
- **User:** "How to get voter id?"
- **Model:** "To get your **Voter ID (EPIC)**, follow these steps:
1. Visit **voterportal.eci.gov.in**.
2. Fill **Form 6** for new registration.
3. Upload identity and address proof.
4. Your card will be delivered after verification (approx. 15 days)."

**Example 2: Technical Query**
- **User:** "What is VVPAT?"
- **Model:** "**VVPAT (Voter Verifiable Paper Audit Trail)** is an independent system attached to the EVM. It allows voters to verify that their vote was cast correctly by showing a paper slip for 7 seconds."

## 3. Model Configuration
To achieve the best balance between creativity and accuracy, we use the following parameters:
- **Temperature:** 0.7 (Allows for natural conversation while remaining factual).
- **Top-P:** 0.95 (Ensures diverse but relevant vocabulary).
- **Top-K:** 40 (Filters out unlikely tokens).
- **Safety Settings:** `HARM_CATEGORY_HARASSMENT`, `HARM_CATEGORY_HATE_SPEECH`, `HARM_CATEGORY_SEXUALLY_EXPLICIT`, and `HARM_CATEGORY_DANGEROUS_CONTENT` are all set to `BLOCK_MEDIUM_AND_ABOVE`.

## 3. Iterative Refinement
The prompt was refined through 3 major stages:
1. **v1 (Basic):** Simple Q&A. Result: Too long and sometimes off-topic.
2. **v2 (Constraint-based):** Added bullet point and length constraints. Result: Better, but lacked "Indian context" nuances.
3. **v3 (Final):** Integrated specific ECI forms (Form 6, 7, 8) and local terminology. Result: Highly accurate and culturally relevant.

## 4. Hybrid Response System
For critical queries (e.g., "how to register"), we implement a **Static Fallback + AI Enrichment** strategy. This ensures that even if the API fails or hits a rate limit, the user receives verified, instant instructions.
