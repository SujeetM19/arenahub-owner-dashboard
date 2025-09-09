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
    const response = await fetch(`${API_BASE_URL}/members`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(memberData),
    });
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

  // Centers API
  async getCenters() {
    const response = await fetch(`${API_BASE_URL}/centers`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createCenter(centerData: any) {
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
}

export default new ApiService();
