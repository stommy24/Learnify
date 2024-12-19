import { supabase } from '../supabaseClient';

interface VerificationRequest {
  userId: string;
  role: 'teacher' | 'guardian';
  documents: File[];
  metadata: {
    method: string;
    additionalInfo?: Record<string, any>;
  };
}

interface VerificationStatus {
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
  expiryDate?: Date;
  verifiedBy?: string;
  notes?: string;
}

export class VerificationManager {
  private static instance: VerificationManager;

  private constructor() {}

  static getInstance(): VerificationManager {
    if (!VerificationManager.instance) {
      VerificationManager.instance = new VerificationManager();
    }
    return VerificationManager.instance;
  }

  async submitVerification(request: VerificationRequest): Promise<string> {
    try {
      // Upload documents to secure storage
      const documentUrls = await this.uploadDocuments(request.documents);

      // Create verification request record
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          user_id: request.userId,
          role: request.role,
          documents: documentUrls,
          metadata: request.metadata,
          status: 'pending',
          submitted_at: new Date().toISOString()
        })
        .single();

      if (error) throw error;

      // Trigger verification workflow
      await this.initiateVerificationWorkflow(data.id);

      return data.id;
    } catch (error) {
      console.error('Verification submission failed:', error);
      throw error;
    }
  }

  private async uploadDocuments(documents: File[]): Promise<string[]> {
    const uploadPromises = documents.map(async (document) => {
      const filename = `${Date.now()}-${document.name}`;
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .upload(filename, document);

      if (error) throw error;
      return data.path;
    });

    return Promise.all(uploadPromises);
  }

  private async initiateVerificationWorkflow(requestId: string): Promise<void> {
    // Implement verification workflow
    // This could include:
    // 1. Document validation
    // 2. Automated checks
    // 3. Manual review queue
    // 4. Notification system
  }

  async checkVerificationStatus(userId: string): Promise<VerificationStatus> {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      status: data.status,
      timestamp: new Date(data.updated_at),
      expiryDate: data.expiry_date ? new Date(data.expiry_date) : undefined,
      verifiedBy: data.verified_by,
      notes: data.notes
    };
  }

  async updateVerificationStatus(
    requestId: string,
    status: 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('verification_requests')
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
        verified_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', requestId);

    if (error) throw error;
  }
}

export const useVerification = () => {
  const verificationManager = VerificationManager.getInstance();
  return {
    submitVerification: verificationManager.submitVerification.bind(verificationManager),
    checkStatus: verificationManager.checkVerificationStatus.bind(verificationManager),
    updateStatus: verificationManager.updateVerificationStatus.bind(verificationManager)
  };
}; 