import { generateResponse } from '../config/openRouter.js';
import User from '../models/user.model.js';
import Website from '../models/website.model.js';
import extractJson from '../utils/extractJson.js';

// this master prompt will be sent to the AI model
const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

// This is the function that will generate the website
export const generateWebsite = async (req, res) => {
  try {
    // getting user prompt
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    console.log(prompt);
    // getting user id
    const userId = req.userId;
    // console.log(userId.toString());
    const user = await User.findById(userId.toString());

    // checking if user is valid and has enough credits
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // checking if user has enough credits
    if (user.credits < 50) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // replacing user prompt in master prompt
    const finalPrompt = masterPrompt.replace('{USER_PROMPT}', prompt);

    let raw = '';
    let parsed = null;

    // retry logic to extract json
    let currentPrompt = finalPrompt;
    for (let i = 0; i < 3 && !parsed; i++) {
      console.log('here11');
      raw = await generateResponse(currentPrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        currentPrompt =
          finalPrompt + '\n\nPlease provide the response in JSON format only';
      }
    }

    // checking if response is valid json
    const { code, message } = parsed;
    console.log(code, message);

    // checking if response is valid json
    if (!code || !message) {
      return res
        .status(400)
        .json({ message: 'Invalid response from AI model' });
    }

    // saving website in database
    const website = await Website.create({
      user: userId,
      title: prompt,
      latestCode: code,
      conversation: [
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'ai',
          content: message,
        },
      ],
    });

    // deducting credits and saving user
    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      remainingCredits: user.credits,
      message: 'Website created successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

//getting website by id
export const getWebsiteBYId = async (req, res) => {
  try {
    // getting website id
    const websiteId = req.params.id;

    // getting website
    const website = await Website.findOne({
      _id: websiteId,
      user: req.user._id,
    });

    // checking if website is valid
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // sending website
    return res.status(200).json(website);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong ${error.message}` });
  }
};

// getting all websites of user
export const getAllWebsites = async (req, res) => {
  try {
    // getting user id
    const userId = req.user.id;

    // getting all websites
    const websites = await Website.find({ user: userId });

    // checking if websites are valid
    if (!websites) {
      return res.status(404).json({ message: 'Websites not found' });
    }

    // sending websites
    return res.status(200).json(websites);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong ${error.message}` });
  }
};

export const changes = async (req, res) => {
  try {
    // getting website
    console.log('function called');
    const websiteId = req.params.id;

    const website = await Website.findOne({
      _id: websiteId,
      user: req.user._id,
    });
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    // getting prompt
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    // getting user id
    const userId = req.user.id;
    const user = await User.findById(userId);

    // checking if user is valid and has enough credits
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // checking if user has enough credits
    if (user.credits < 25) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    const updatedPrompt = `
UPDATE THIS HTML WEBSITE.

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}

RETURN RAW JSON ONLY:
{
  "message": "Short confirmation",
  "code": "<UPDATED FULL HTML>"
}
`;

    let raw = '';
    let parsed = null;

    // retry logic to extract json
    let currentPrompt = updatedPrompt;
    for (let i = 0; i < 3 && !parsed; i++) {
      raw = await generateResponse(currentPrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        currentPrompt =
          updatedPrompt + '\n\nPlease provide the response in JSON format only';
      }
    }

    if (!parsed || !parsed.code || !parsed.message) {
      return res
        .status(400)
        .json({ message: 'Invalid response from AI model' });
    }

    website.conversation.push(
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'ai',
        content: parsed?.message,
      },
    );

    website.latestCode = parsed?.code;
    await website.save();

    user.credits -= 25;
    await user.save();
    console.log('call completed');

    return res.status(200).json({
      message: 'Website updated successfully',
      code: parsed.code,
      remainingCredits: user.credits,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong ${error.message}` });
  }
};

export const deploy = async (req, res) => {
  console.log('function called');
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    if (!website.slug) {
      website.slug =
        website.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
          .slice(0, 60) + website._id.toString().slice(-5);
    }
    website.deployed = true;
    const deployedUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
    website.deployUrl = deployedUrl;
    await website.save();

    return res.status(200).json({
      message: 'Website deployed successfully',
      url: deployedUrl,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Something went wrong during deployement ${error.message}`,
    });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const website = await Website.findOne({
      slug,
      deployed: true,
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    return res.status(200).json(website);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Something went wrong ${error.message}` });
  }
};
