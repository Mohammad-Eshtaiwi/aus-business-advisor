export type SuggestionsState = {
  isLoading: boolean;
  error: string | null;
  suggestions: string;
  openModal: boolean;
};

export type SuggestionsAction =
  | { type: 'SUBMIT' }
  | { type: 'SUCCESS'; payload: string }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }
  | { type: 'CLOSE_MODAL' };

export const initialState: SuggestionsState = {
  isLoading: false,
  error: null,
  suggestions: '',
  openModal: false,
};

export function suggestionsReducer(
  state: SuggestionsState,
  action: SuggestionsAction
): SuggestionsState {
  switch (action.type) {
    case 'SUBMIT':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'SUCCESS':
      return {
        isLoading: false,
        error: null,
        suggestions: action.payload,
        openModal: true,
      };
    case 'ERROR':
      return {
        isLoading: false,
        error: action.payload,
        suggestions: '',
        openModal: false,
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        openModal: false,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
