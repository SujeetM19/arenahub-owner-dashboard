const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('ownerToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Owner Authentication
  async signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/owner/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async signUp(name: string, email: string, password: string, businessName: string) {
    const response = await fetch(`${API_BASE_URL}/owner/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, businessName }),
    });
    return response.json();
  }

  // Members API
  async getMembers(queryParams = '') {
    const url = queryParams ? `${API_BASE_URL}/members?${queryParams}` : `${API_BASE_URL}/members`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createMember(memberData: any) {
    // First, get the user's gyms to get the gymId
    const gyms = await this.getGyms();
    if (!gyms || gyms.length === 0) {
      throw new Error('No gym found. Please create a gym first.');
    }
    
    // Use the first gym (most recent)
    const gymId = gyms[0].id;
    
    const response = await fetch(`${API_BASE_URL}/members?gymId=${gymId}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create member');
    }
    
    return response.json();
  }

  async updateMember(id: number, memberData: any) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(memberData),
    });
    return response.json();
  }

  async deleteMember(id: number) {
    const response = await fetch(`${API_BASE_URL}/members/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getMemberStats() {
    const response = await fetch(`${API_BASE_URL}/members/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Gyms API
  async getGyms() {
    const response = await fetch(`${API_BASE_URL}/gyms`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getMembershipPlans() {
    const response = await fetch(`${API_BASE_URL}/membership-plans`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createMembershipPlan(planData: any) {
    const response = await fetch(`${API_BASE_URL}/membership-plans`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return response.json();
  }

  async updateMembershipPlan(id: number, planData: any) {
    const response = await fetch(`${API_BASE_URL}/membership-plans/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return response.json();
  }

  async deleteMembershipPlan(id: number) {
    const response = await fetch(`${API_BASE_URL}/membership-plans/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Facilities API
  async getFacilities() {
    const response = await fetch(`${API_BASE_URL}/facilities`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createFacility(facilityData: any) {
    const response = await fetch(`${API_BASE_URL}/facilities`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(facilityData),
    });
    return response.json();
  }

  async updateFacility(id: number, facilityData: any) {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(facilityData),
    });
    return response.json();
  }

  async deleteFacility(id: number) {
    const response = await fetch(`${API_BASE_URL}/facilities/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Notifications API
  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createNotification(notificationData: any) {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(notificationData),
    });
    return response.json();
  }

  async markNotificationAsRead(id: number) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async deleteNotification(id: number) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Alerts API
  async getAlerts() {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createAlert(alertData: any) {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(alertData),
    });
    return response.json();
  }

  async getAlertTemplates() {
    const response = await fetch(`${API_BASE_URL}/alerts/templates`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Centers API (Legacy)
  async getCentersLegacy() {
    const response = await fetch(`${API_BASE_URL}/centers`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createCenterLegacy(centerData: any) {
    const response = await fetch(`${API_BASE_URL}/centers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(centerData),
    });
    return response.json();
  }

  async getCenterComparison() {
    const response = await fetch(`${API_BASE_URL}/centers/comparison`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Statistics API
  async getStatistics() {
    const response = await fetch(`${API_BASE_URL}/statistics`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Attendance API (for QR code attendance)
  async markAttendance(memberId: number, qrCode: string) {
    const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ memberId, qrCode }),
    });
    return response.json();
  }

  async getAttendanceStats() {
    const response = await fetch(`${API_BASE_URL}/attendance/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getAttendanceHistory(memberId?: number) {
    const url = memberId 
      ? `${API_BASE_URL}/attendance/history?memberId=${memberId}`
      : `${API_BASE_URL}/attendance/history`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Gallery API
  async getGalleryItems(queryParams = '') {
    const url = queryParams ? `${API_BASE_URL}/gallery?${queryParams}` : `${API_BASE_URL}/gallery`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createGalleryItem(galleryData: any) {
    // First, get the user's gyms to get the gymId
    const gyms = await this.getGyms();
    if (!gyms || gyms.length === 0) {
      throw new Error('No gym found. Please create a gym first.');
    }
    
    // Use the first gym (most recent)
    const gymId = gyms[0].id;
    
        // If galleryData is FormData (file upload), use the upload endpoint
        if (galleryData instanceof FormData) {
          // Add the gymId to the FormData
          galleryData.append('gymId', gymId.toString());
      
      const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ownerToken')}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: galleryData,
      });
      return response.json();
        } else {
          // For JSON data, add gymId and send as JSON
          const dataWithGymId = {
            ...galleryData,
            gymId: gymId
          };
      
      const response = await fetch(`${API_BASE_URL}/gallery`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(dataWithGymId),
      });
      return response.json();
    }
  }

  async updateGalleryItem(id: number, galleryData: any) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(galleryData),
    });
    return response.json();
  }

  async deleteGalleryItem(id: number) {
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async deleteGalleryItems(ids: number[]) {
    const response = await fetch(`${API_BASE_URL}/gallery/bulk`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ids),
    });
    return response.json();
  }

  async getGalleryStats() {
    const response = await fetch(`${API_BASE_URL}/gallery/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Inventory API
  async getInventoryItems(queryParams = '') {
    const url = queryParams ? `${API_BASE_URL}/inventory?${queryParams}` : `${API_BASE_URL}/inventory`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createInventoryItem(inventoryData: any) {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inventoryData),
    });
    return response.json();
  }

  async updateInventoryItem(id: number, inventoryData: any) {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inventoryData),
    });
    return response.json();
  }

  async deleteInventoryItem(id: number) {
    const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async deleteInventoryItems(ids: number[]) {
    const response = await fetch(`${API_BASE_URL}/inventory/bulk`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ids),
    });
    return response.json();
  }

  async getInventoryStats() {
    const response = await fetch(`${API_BASE_URL}/inventory/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getLowStockItems() {
    const response = await fetch(`${API_BASE_URL}/inventory/low-stock`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getOutOfStockItems() {
    const response = await fetch(`${API_BASE_URL}/inventory/out-of-stock`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Staff API
  async getStaff(queryParams = '') {
    const url = queryParams ? `${API_BASE_URL}/staff?${queryParams}` : `${API_BASE_URL}/staff`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        error: errorData.error || 'Request failed',
        message: errorData.message || `HTTP ${response.status}`,
        ...errorData
      };
    }
    
    return response.json();
  }

  async createStaff(staffData: any) {
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(staffData),
    });
    return response.json();
  }

  async updateStaff(id: number, staffData: any) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(staffData),
    });
    return response.json();
  }

  async deleteStaff(id: number) {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async deleteStaffBulk(ids: number[]) {
    const response = await fetch(`${API_BASE_URL}/staff/bulk`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ids),
    });
    return response.json();
  }

  async getStaffStats() {
    const response = await fetch(`${API_BASE_URL}/staff/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getActiveStaff() {
    const response = await fetch(`${API_BASE_URL}/staff/active`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Trainers API
  async getTrainers(queryParams = '') {
    const url = queryParams ? `${API_BASE_URL}/trainers?${queryParams}` : `${API_BASE_URL}/trainers`;
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createTrainer(trainerData: any) {
    const response = await fetch(`${API_BASE_URL}/trainers`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(trainerData),
    });
    return response.json();
  }

  async updateTrainer(id: number, trainerData: any) {
    const response = await fetch(`${API_BASE_URL}/trainers/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(trainerData),
    });
    return response.json();
  }

  async deleteTrainer(id: number) {
    const response = await fetch(`${API_BASE_URL}/trainers/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async deleteTrainers(ids: number[]) {
    const response = await fetch(`${API_BASE_URL}/trainers/bulk`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(ids),
    });
    return response.json();
  }

  async getTrainerStats() {
    const response = await fetch(`${API_BASE_URL}/trainers/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getActiveTrainers() {
    const response = await fetch(`${API_BASE_URL}/trainers/active`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Fundamentals API
  async getCenters() {
    const response = await fetch(`${API_BASE_URL}/fundamentals/gyms`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getCenterById(id: number) {
    const response = await fetch(`${API_BASE_URL}/fundamentals/gyms/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async updateCenter(id: number, centerData: any) {
    const response = await fetch(`${API_BASE_URL}/fundamentals/gyms/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(centerData),
    });
    return response.json();
  }

  async createCenter(centerData: any) {
    const response = await fetch(`${API_BASE_URL}/fundamentals/gyms`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(centerData),
    });
    return response.json();
  }

  async deleteCenter(id: number) {
    const response = await fetch(`${API_BASE_URL}/fundamentals/gyms/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }


  // Analytics API
  async getAnalytics(centerId: number, period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getRevenueAnalytics(centerId: number, period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}/revenue?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getAttendanceAnalytics(centerId: number, period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}/attendance?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getMemberAnalytics(centerId: number, period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}/members?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getGeneralAnalytics(centerId: number, period: string = 'month') {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}/general?period=${period}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getKeyMetrics(centerId: number) {
    const response = await fetch(`${API_BASE_URL}/analytics/${centerId}/metrics`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new ApiService();
