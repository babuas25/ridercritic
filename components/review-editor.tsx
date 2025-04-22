'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
  motorcycle: string;
  images: FileList | null;
}

export default function ReviewEditor() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>({
    title: '',
    content: '',
    rating: 5,
    motorcycle: '',
    images: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to publish a review.",
        variant: "destructive",
      });
      router.push('/auth/login');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // TODO: Implement review submission logic
      
      toast({
        title: "Review Published",
        description: "Your review has been successfully published.",
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        rating: 5,
        motorcycle: '',
        images: null,
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <CardDescription>
            Share your experience with the motorcycle community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motorcycle">Motorcycle</Label>
            <Select
              value={formData.motorcycle}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, motorcycle: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select motorcycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="honda-cbr">Honda CBR</SelectItem>
                <SelectItem value="kawasaki-ninja">Kawasaki Ninja</SelectItem>
                <SelectItem value="yamaha-r1">Yamaha R1</SelectItem>
                <SelectItem value="ducati-panigale">Ducati Panigale</SelectItem>
                <SelectItem value="bmw-s1000rr">BMW S1000RR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your review a title"
              value={formData.title}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Review</Label>
            <Textarea
              id="content"
              placeholder="Write your review here..."
              className="min-h-[200px]"
              value={formData.content}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, content: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select
              value={formData.rating.toString()}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, rating: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {"★".repeat(rating) + "☆".repeat(5 - rating)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => 
                setFormData(prev => ({ ...prev, images: e.target.files }))
              }
            />
            <p className="text-sm text-muted-foreground">
              Upload up to 5 images (optional)
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Save Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                Publishing...
              </>
            ) : (
              'Publish Review'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}