export type AiBehaviourPrediction =
    | "cake_enquiry"
    | "services_enquiry"
    | "about_us_enquiry"
    | "purchase_Intent_Detected"
    | "order_abandoned"
    | "complaint"
    | null;

export interface AiResponse{
    text: string,
    event: AiBehaviourPrediction
}