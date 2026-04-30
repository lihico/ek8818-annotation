const RATIONALES = [
  {
    "id": 1,
    "rationale": "The intervention offers a helpful reflection that allows the client to begin processing their thoughts, but it doesn't go too deep."
  },
  {
    "id": 2,
    "rationale": "Sounds like the therapist is trying to justify himself and not concerned with the patient's experience."
  },
  {
    "id": 3,
    "rationale": "Interpretation of dominant and hidden self-voices, interpretation of thought patterns, emotion and behavior (adaptive or non-adaptive) at a good level.   - there is a certain degree of request for expansion, but . Questions may be closed-ended, leading to yes or no answers"
  },
  {
    "id": 4,
    "rationale": "Unempathetic intervention that places responsibility for the patient's difficulty on him"
  },
  {
    "id": 5,
    "rationale": "there is a certain degree of request for expansion, but it remains somewhat \n a closed question."
  },
  {
    "id": 6,
    "rationale": "The wishful exploration is beneficial but somewhat generic."
  },
  {
    "id": 7,
    "rationale": "The therapist begins to question some of the client's statements, but his thoughts remain incomplete."
  },
  {
    "id": 8,
    "rationale": "The intervention offers a reflection on the client's emotional strengths, which can help validate their abilities. However, the reference to titles is somewhat unclear, which may reduce its overall clarity and effectiveness."
  },
  {
    "id": 9,
    "rationale": "The interpretation is surface level, with minimal depth or insight. While there may be some attempt to identify the client's patterns, this interpretation tends to be inaccurate or oversimplified and do not lead the clients for an insight."
  },
  {
    "id": 10,
    "rationale": "The therapist makes some reference to dominant or hidden self-voices in the client, but without an in-depth explanation that would enable a significant deepening of the client's insight. It is to vage"
  },
  {
    "id": 11,
    "rationale": "The therapist asks a concrete question whose context is unclear."
  },
  {
    "id": 12,
    "rationale": "The therapist brings the conversation back to relevant work areas and tries to deepen the patient's experience"
  },
  {
    "id": 13,
    "rationale": "The therapist tries to understand the patient's experience in order to get to know her in depth."
  },
  {
    "id": 14,
    "rationale": "The intervention encourages the client to explore further, however the intervention is somewhat superficial"
  },
  {
    "id": 15,
    "rationale": "the therapist gives good quality advice. The therapist pushes the patient to behave differently or challenges thinking patterns and does it in a good way, but it is vague and slightly trivial."
  },
  {
    "id": 16,
    "rationale": "to many qestiones together"
  },
  {
    "id": 17,
    "rationale": "The therapist interprets the patient's behavior and allows her to look at her pattern from a new angle."
  },
  {
    "id": 18,
    "rationale": "It seems like an accurate reflection, but in my opinion lacks an element of warmth and empathy and/or exploration of the feelings he felt"
  },
  {
    "id": 19,
    "rationale": "It seems that the patient is still trying to cope with what he is going through and is having difficulty sharing. At this point in the conversation, the statement about focusing on the solution actually blocks the possibility of developing reflective abilities and getting closer."
  },
  {
    "id": 20,
    "rationale": "This intervention expresses support and encouragement for the client to continue treatment, which is positive. However, the mention of payment feels abrupt and could be better integrated into the conversation to avoid confusion or discomfort for the client. further details regarding the client options should be incorporated."
  },
  {
    "id": 21,
    "rationale": "A continuation of a previous intervention that does not add value"
  },
  {
    "id": 22,
    "rationale": "It is clear that the therapist understands the patient and his reflection seems accurate."
  },
  {
    "id": 23,
    "rationale": "The therapist refers to the patient's need and emphasizes the importance of her being in psychological treatment, there is no potential for significant deepening, but there is recognition of her needs"
  },
  {
    "id": 24,
    "rationale": "interrupted intervention. An interesting interpretation but it is not clear how innovative it is"
  },
  {
    "id": 25,
    "rationale": "The therapist moves the patient toward a deeper understanding of her emotional experience."
  },
  {
    "id": 26,
    "rationale": "The intervention attempts to highlight a recurring dynamic in the client's life. However, instead of moving from the therapeutic connection outward, as intended, the therapist remains within the realms of the therapeutic alliance. In this case, a directive approach might have been better suited than an explorative one. Generally, there seems to be some confusion in the therapeutic alliance that is not fully addressed."
  },
  {
    "id": 27,
    "rationale": "The therapist points to cognitive, emotional, or behavioral patterns (adaptive or non-adaptive) in a way that aligns with the client's words, yet does so in a somewhat trivial manner. there is a certain degree of request for expansion, but it remains somewhat superficial"
  },
  {
    "id": 28,
    "rationale": "The intervention normalizes the client's experience. While the therapist doesn't delve too deeply into the client's motives, the intervention can still foster positive feelings of support and understanding, which are crucial for strengthening the therapeutic alliance."
  },
  {
    "id": 29,
    "rationale": "The therapist tries to understand the patient's experience in order to get to know her in depth."
  },
  {
    "id": 30,
    "rationale": "The therapist's emotional reaction here is somewhat unclear, as the client is giving the 'stepping on toes' example as a figure of speech."
  },
  {
    "id": 31,
    "rationale": "This intervention is somewhat repetitive, as the therapist has already asked a similar question earlier, which can make it feel redundant. While it encourages further exploration, the therapist could have explained it further."
  },
  {
    "id": 32,
    "rationale": "there is a good degree of invitation to expand. The therapist tries to find out feelings and thoughts, more hidden voices of the self, an investigation with added value around the patient's experience."
  },
  {
    "id": 33,
    "rationale": "The interpretation corresponds to the visible/hidden voices of the patient, but at this stage it would be better in my opinion to investigate why it is difficult for him to say it and not to say it instead of him"
  },
  {
    "id": 34,
    "rationale": "The intervention is cold and robotic. The interpretation is very superficial and general and the question of expansion feels unrelated to the sequence of the conversation"
  },
  {
    "id": 35,
    "rationale": "The intervention is superficial and not innovative."
  },
  {
    "id": 36,
    "rationale": "This intervention effectively encourages the client to reflect on their discomfort by connecting it to their emotional world."
  },
  {
    "id": 37,
    "rationale": "While the connection to the end of the therapy sessions feels abrupt and the intervention itself is somewhat vague, it seems to be an important topic that the therapist needed to address and incorporate into the session."
  },
  {
    "id": 38,
    "rationale": "there is a good degree of invitation to expand. The therapist tries to find out feelings and thoughts, more hidden voices of the self, an investigation with added value around the patient's experience."
  },
  {
    "id": 39,
    "rationale": "Interpretation of dominant and hidden self-voices, interpretation of thought patterns, emotion and behavior (adaptive or non-adaptive)  A description that invites expansion in the patient's insight."
  },
  {
    "id": 40,
    "rationale": "The therapist feels connected to the patient's experience and gives space to her feelings."
  },
  {
    "id": 41,
    "rationale": "The intervention offers reflection, but while the themes are relevant to the client, it challenges their perfectionism more than it addresses their feelings of disappointment. As a result, its delivery misses the mark and may  cause confusion"
  },
  {
    "id": 42,
    "rationale": "The therapist's instructions are somewhat aligned with the patient's needs, but lack specificity and may be delivered in a way that does not fully engage the patient. This reaction is a bit regecting the patient and can be hurtfull."
  },
  {
    "id": 43,
    "rationale": "The interpretation is not so clear, a bit trivial and does not advance the patient"
  },
  {
    "id": 44,
    "rationale": "The therapist repeats things that were said earlier and it is unclear how this advances the patient's understanding of herself."
  },
  {
    "id": 45,
    "rationale": "The interpretation is surface level, with minimal depth or insight. While there may be some attempt to identify the client's patterns, this interpretation tends to be inaccurate or oversimplified and do not lead the clients for an insight.  Exploration could have been appropriate here"
  },
  {
    "id": 46,
    "rationale": "The therapist suggests a clear course of action to build motivation; however, the intervention could benefit from a more supportive approach that validates the client's frustration while highlighting the temporary nature of their feelings."
  },
  {
    "id": 47,
    "rationale": "- there is a good degree of invitation to expand. The therapist tries to find out feelings and thoughts, more hidden voices of the self, an investigation with added value around the patient's experience."
  },
  {
    "id": 48,
    "rationale": "There is an attempt to refine the client's experience, but it remains superficial"
  },
  {
    "id": 49,
    "rationale": "The therapist addresses the complexity of the patient's experience and gives her the space to decide how to address this in treatment."
  },
  {
    "id": 50,
    "rationale": "not relavent to the meaning of the conversation"
  }
];