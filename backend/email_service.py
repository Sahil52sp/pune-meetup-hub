import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("SENDGRID_FROM_EMAIL", "kankshit.majhodkar17@gmail.com")
        
        if not self.api_key:
            logger.warning("SendGrid API key not found. Email functionality will be disabled.")
            self.client = None
        else:
            self.client = SendGridAPIClient(api_key=self.api_key)

    def _get_frontend_url(self, request_host: str = None) -> str:
        """Determine frontend URL based on current environment"""
        if request_host:
            # Use the host from the request to determine frontend URL
            if request_host.startswith("localhost") or "127.0.0.1" in request_host:
                return "http://localhost:3000"  # Default Vite dev port
            elif "preview.emergentagent.com" in request_host:
                return "https://techconnect-15.preview.emergentagent.com"
            else:
                # For custom domains or production, try to infer frontend URL
                return f"https://{request_host.replace('api.', '').replace(':8000', '')}"
        else:
            # Fallback to environment variable or default
            return os.getenv("FRONTEND_URL", "https://techconnect-15.preview.emergentagent.com")

    async def send_connection_request_email(
        self,
        receiver_email: str,
        receiver_name: str,
        sender_name: str,
        message: Optional[str] = None,
        request_host: str = None
    ) -> bool:
        """Send email notification for connection request"""
        if not self.client:
            logger.warning("SendGrid client not initialized. Skipping email.")
            return False

        try:
            subject = f"New Connection Request from {sender_name}"
            
            # Get frontend URL and create link to connections page
            frontend_url = self._get_frontend_url(request_host)
            connections_link = f"{frontend_url}/connections"
            
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #007bff; margin-bottom: 20px;">New Connection Request</h2>
                    <p>Hi {receiver_name},</p>
                    <p>You have received a new connection request from <strong>{sender_name}</strong>.</p>
                    {f'<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; border-radius: 4px;"><p style="margin: 0; font-weight: bold;">Message:</p><p style="font-style: italic; margin: 10px 0 0 0;">"{message}"</p></div>' if message else ''}
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{connections_link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View Connection Request</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">To respond to this request, click the button above or log in to your Pune Meetup Hub account.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Best regards,<br>
                        Pune Meetup Hub Team
                    </p>
                </div>
            </body>
            </html>
            """
            
            plain_content = f"""
            New Connection Request
            
            Hi {receiver_name},
            
            You have received a new connection request from {sender_name}.
            {f'Message: {message}' if message else ''}
            
            To respond to this request, visit: {connections_link}
            
            Best regards,
            Pune Meetup Hub Team
            """

            mail = Mail(
                from_email=self.from_email,
                to_emails=receiver_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )

            response = self.client.send(mail)
            
            if response.status_code == 202:
                logger.info(f"Connection request email sent successfully to {receiver_email}")
                return True
            else:
                logger.error(f"Failed to send email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending connection request email: {str(e)}")
            return False

    async def send_connection_accepted_email(
        self,
        sender_email: str,
        sender_name: str,
        accepter_name: str,
        request_host: str = None
    ) -> bool:
        """Send email notification when connection request is accepted"""
        if not self.client:
            logger.warning("SendGrid client not initialized. Skipping email.")
            return False

        try:
            subject = f"{accepter_name} accepted your connection request!"
            
            # Get frontend URL and create link to messaging page
            frontend_url = self._get_frontend_url(request_host)
            messaging_link = f"{frontend_url}/messaging"
            
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #28a745; margin-bottom: 20px;">🎉 Connection Accepted!</h2>
                    <p>Hi {sender_name},</p>
                    <p>Great news! <strong>{accepter_name}</strong> has accepted your connection request.</p>
                    <p>You can now start messaging each other and build your professional network.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{messaging_link}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Start Messaging</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Click the button above to start your conversation with {accepter_name}.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Best regards,<br>
                        Pune Meetup Hub Team
                    </p>
                </div>
            </body>
            </html>
            """
            
            plain_content = f"""
            Connection Accepted!
            
            Hi {sender_name},
            
            Great news! {accepter_name} has accepted your connection request.
            
            You can now start messaging each other and build your professional network.
            
            Start messaging: {messaging_link}
            
            Best regards,
            Pune Meetup Hub Team
            """

            mail = Mail(
                from_email=self.from_email,
                to_emails=sender_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )

            response = self.client.send(mail)
            
            if response.status_code == 202:
                logger.info(f"Connection accepted email sent successfully to {sender_email}")
                return True
            else:
                logger.error(f"Failed to send connection accepted email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending connection accepted email: {str(e)}")
            return False

    async def send_message_notification_email(
        self,
        receiver_email: str,
        receiver_name: str,
        sender_name: str,
        message_content: str,
        conversation_id: str,
        request_host: str = None,
        message_preview: str = None
    ) -> bool:
        """Send email notification for new message"""
        if not self.client:
            logger.warning("SendGrid client not initialized. Skipping email.")
            return False

        try:
            # Truncate message content for preview if it's too long
            if not message_preview:
                message_preview = message_content[:100] + "..." if len(message_content) > 100 else message_content
            
            subject = f"New Message from {sender_name}"
            
            # Get frontend URL and create direct link to conversation
            frontend_url = self._get_frontend_url(request_host)
            message_link = f"{frontend_url}/messaging?conversation={conversation_id}"
            
            html_content = f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #007bff; margin-bottom: 20px;">New Message</h2>
                    <p>Hi {receiver_name},</p>
                    <p>You have received a new message from <strong>{sender_name}</strong>.</p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; border-radius: 4px;">
                        <p style="margin: 0; font-weight: bold;">Message:</p>
                        <p style="font-style: italic; margin: 10px 0 0 0;">"{message_preview}"</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{message_link}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Go to Message</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">To read the full message and reply, click the button above or log in to your Pune Meetup Hub account.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #666; font-size: 12px;">
                        Best regards,<br>
                        Pune Meetup Hub Team
                    </p>
                </div>
            </body>
            </html>
            """
            
            plain_content = f"""
            New Message
            
            Hi {receiver_name},
            
            You have received a new message from {sender_name}.
            
            Message: "{message_preview}"
            
            To read the full message and reply, visit: {message_link}
            
            Best regards,
            Pune Meetup Hub Team
            """

            mail = Mail(
                from_email=self.from_email,
                to_emails=receiver_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )

            response = self.client.send(mail)
            
            if response.status_code == 202:
                logger.info(f"Message notification email sent successfully to {receiver_email}")
                return True
            else:
                logger.error(f"Failed to send message notification email. Status code: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending message notification email: {str(e)}")
            return False


# Global email service instance
email_service = EmailService()