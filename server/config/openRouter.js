const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

export const generateResponse = async (prompt) => {
  // const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: MODEL,
  //     messages: [
  //       {
  //         role: 'user',
  //         content: 'What is the meaning of life?',
  //       },
  //     ],
  //   }),
  // });
  // console.log(result);
  const text = await result.text();
  console.log(text);
  const res = await fetch(openRouterUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You must return ONLY valid raw JSON.' },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('openRouter err' + err);
  }

  const data = await res.json();
  return data.choices[0].message.content;
};
